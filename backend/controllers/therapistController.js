import { Types } from "mongoose";
import User from "../models/User.js";
import TherapistProfile from "../models/TherapistProfile.js";
import Review from "../models/Review.js";
import { generateAvailability } from "../utils/availability.util.js";
import { validationResult } from "express-validator";

/* -------------------- Helpers -------------------- */
const toObjectId = (id) => (typeof id === "string" ? new Types.ObjectId(id) : id);
const parseYears = (s) => {
  if (!s) return 0;
  const m = /(\d+)/.exec(String(s));
  return m ? parseInt(m[1], 10) : 0;
};
const splitTags = (s) =>
  !s ? [] :
  String(s).split(/[,\|/]/).map((x) => x.trim()).filter(Boolean);

/* -------------------- Slots -------------------- */
export async function getGeneratedSlots(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const therapistId = req.params.id;
    const { startDate, days } = req.query;

    const slots = await generateAvailability({
      therapistId,
      startDate,
      days: days ? Number(days) : 7,
    });

    res.json({
      therapistId,
      startDate: startDate || new Date().toISOString().slice(0, 10),
      days: days ? Number(days) : 7,
      slots,
    });
  } catch (err) {
    next(err);
  }
}

/* -------------------- List Therapists -------------------- */
export async function list(req, res) {
  try {
    const { search = "", specialization } = req.query;
    const rx = search ? new RegExp(search, "i") : null;
    const rxSpec = specialization && specialization !== "All Specializations"
      ? new RegExp(`^${specialization}$`, "i")
      : null;

    const pipeline = [
      { $match: { role: "therapist" } },
      {
        $lookup: {
          from: "therapistprofiles",
          localField: "_id",
          foreignField: "userId",
          as: "profile",
        },
      },
      { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
    ];

    if (rx || rxSpec) {
      const $or = [];
      if (rx)
        $or.push(
          { name: rx },
          { "profile.specialization": rx },
          { "profile.bio": rx },
          { "profile.languages": rx },
          { "profile.location": rx }
        );
      if (rxSpec) $or.push({ "profile.specialization": rxSpec });
      pipeline.push({ $match: { $or } });
    }

    pipeline.push(
      {
        $lookup: {
          from: "reviews",
          let: { tid: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$reviewed", "$$tid"] },
                    { $eq: ["$type", "therapist"] },
                  ],
                },
              },
            },
            { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
          ],
          as: "stats",
        },
      },
      {
        $addFields: {
          rating: { $round: [{ $ifNull: [{ $arrayElemAt: ["$stats.avg", 0] }, 0] }, 2] },
          reviews: { $ifNull: [{ $arrayElemAt: ["$stats.count", 0] }, 0] },
        },
      }
    );

    const docs = await User.aggregate(pipeline);

    const items = docs.map((d) => ({
      id: d._id,
      name: d.name || "Therapist",
      headline: d.profile?.specialization || "",
      fee: d.profile?.fee ?? 0,
      years: parseYears(d.profile?.experience),
      location: d.profile?.location || "",
      languages: d.profile?.languages || [],
      rating: d.rating || 0,
      reviews: d.reviews || 0,
      summary: (d.profile?.bio || "").slice(0, 200),
      tags: splitTags(d.profile?.specialization),
      avatarUrl: d.avatarUrl || d.profile?.avatarUrl || "",
    }));

    res.json({ items });
  } catch (e) {
    console.error("Therapist list error:", e);
    res.status(500).json({ message: "Failed to load therapists" });
  }
}

/* -------------------- Get One Therapist -------------------- */
export async function getOne(req, res) {
  try {
    const therapistUserId = toObjectId(req.params.id);
    const user = await User.findById(therapistUserId).lean();
    if (!user || user.role !== "therapist")
      return res.status(404).json({ message: "Therapist not found" });

    const profile = await TherapistProfile.findOne({ userId: therapistUserId }).lean();
    const [stat] = await Review.aggregate([
      { $match: { reviewed: therapistUserId, type: "therapist" } },
      { $group: { _id: "$reviewed", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    res.json({
      id: user._id,
      name: user.name || "Therapist",
      headline: profile?.specialization || "",
      rating: stat ? Number(stat.avg.toFixed(2)) : 0,
      reviews: stat ? stat.count : 0,
      fee: profile?.fee ?? 0,
      years: parseYears(profile?.experience),
      location: profile?.location || "",
      languages: profile?.languages || [],
      bio: profile?.bio || "",
      specialties: splitTags(profile?.specialization),
      license: profile?.license || "",
      education: profile?.qualifications || "",
      avatarUrl: user.avatarUrl || profile?.avatarUrl || "",
    });
  } catch (e) {
    console.error("Therapist getOne error:", e);
    res.status(500).json({ message: "Failed to load therapist" });
  }
}

/* -------------------- Reviews -------------------- */
export async function reviews(req, res) {
  try {
    const therapistUserId = toObjectId(req.params.id);
    const [agg] = await Review.aggregate([
      { $match: { reviewed: therapistUserId, type: "therapist" } },
      { $group: { _id: "$reviewed", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    const items = await Review.find({ reviewed: therapistUserId, type: "therapist" })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      average: agg ? Number(agg.avg.toFixed(2)) : 0,
      count: agg ? agg.count : 0,
      items: items.map((r) => ({
        id: r._id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      })),
    });
  } catch (e) {
    console.error("Therapist reviews error:", e);
    res.status(500).json({ message: "Failed to load reviews" });
  }
}

/* -------------------- Availability -------------------- */
export async function availability(req, res) {
  try {
    const therapistUserId = req.params.id;
    const { start, days } = req.query;
    const slots = await generateAvailability({
      therapistId: therapistUserId,
      startDate: start,
      days: Math.max(1, Math.min(Number(days) || 7, 30)),
    });
    res.json({ slots });
  } catch (e) {
    console.error("Therapist availability error:", e);
    res.status(500).json({ message: "Failed to load availability" });
  }
}

/* -------------------- Profile Create/Update -------------------- */
/* -------------------- Profile Create/Update -------------------- */
export async function createOrUpdateProfile(req, res) {
  try {
    const userId = req.user._id;
    let {
      license,
      specialization,
      bio,
      experience,
      qualifications,
      languages,
      fee,
      location,
      avatarUrl,
      workDays,
      startHour,
      endHour,
      slotMinutes,
    } = req.body;

    if (typeof languages === "string") {
      languages = languages.split(/[,\|/]/).map((x) => x.trim()).filter(Boolean);
    }
    if (typeof workDays === "string") {
      workDays = workDays
        .split(/[,\|/]/)
        .map((x) => Number(x))
        .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);
    }

    const update = {
      ...(license !== undefined && { license }),
      ...(specialization !== undefined && { specialization }),
      ...(bio !== undefined && { bio }),
      ...(experience !== undefined && { experience }),
      ...(qualifications !== undefined && { qualifications }),
      ...(languages !== undefined && { languages }),
      ...(fee !== undefined && { fee: Number(fee) >= 0 ? Number(fee) : 0 }),
      ...(location !== undefined && { location }),
      ...(avatarUrl !== undefined && { avatarUrl }),
      ...(workDays !== undefined && { workDays }),
      ...(startHour !== undefined && { startHour: Number(startHour) }),
      ...(endHour !== undefined && { endHour: Number(endHour) }),
      ...(slotMinutes !== undefined && { slotMinutes: Number(slotMinutes) }),
    };

    const doc = await TherapistProfile.findOneAndUpdate(
      { userId },
      { $set: update, $setOnInsert: { userId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // ✅ emit real-time event if socket is running
    const io = req.app.get("io");
    if (io) {
      io.emit("therapist:registered", {
        id: req.user._id,
        name: req.user.name,
        specialization: doc.specialization || "",
        location: doc.location || "",
        avatarUrl: doc.avatarUrl || "",
      });
    }

    res.status(200).json(doc);
  } catch (e) {
    console.error("createOrUpdateProfile error:", e);
    res.status(500).json({ message: "Failed to save profile" });
  }
}

export async function getProfileByUserId(req, res) {
  try {
    const therapistUserId = toObjectId(req.params.userId);
    const doc = await TherapistProfile.findOne({ userId: therapistUserId }).lean();
    if (!doc) return res.status(404).json({ message: "Profile not found" });
    res.json(doc);
  } catch (e) {
    console.error("getProfileByUserId error:", e);
    res.status(500).json({ message: "Failed to load profile" });
  }
}
