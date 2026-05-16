import { v2 as cloudinary } from 'cloudinary';
import Ad from '../models/adsModel.js';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createAd = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });

    const {
      businessName,
      businessEmail,
      title,
      description,
      targetUrl,
      placement,
      durationDays,
      amountPaid,
      status
    } = req.body;

    if (!businessName || !businessEmail || !title || !targetUrl || !placement || !durationDays || !amountPaid) {
      return res.status(400).json({ message: 'All required fields must be fulfilled.' });
    }


    const cloudinaryResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'adopt-neighbor/ads', resource_type: 'image' },
        (error, result) => { if (error) reject(error); else resolve(result); }
      );
      stream.end(req.file.buffer);
    });

    let startDate = null;
    let endDate = null;
    if (status === "ACTIVE") {
      startDate = new Date();
      endDate = new Date();
      endDate.setDate(startDate.getDate() + Number(durationDays));
    }

    const newAd = new Ad({
      businessName,
      businessEmail,
      title,
      description,
      image: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      targetUrl,
      placement,
      durationDays: Number(durationDays),
      amountPaid: Number(amountPaid),
      startDate,
      endDate,
      status: status || "PENDING_PAYMENT"
    });

    await newAd.save();
    res.status(201).json(newAd);
  } catch (error) {
    console.error('createAd error:', error.message);
    res.status(500).json({ message: 'Failed to create ad' });
  }
};

const getAds = async (req, res) => {
  try {
    const { placement } = req.query;

    const query = placement ? { placement, status: "ACTIVE" } : {};

    const ads = await Ad.find(query).sort({ createdAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    console.error('getAds error:', error.message);
    res.status(500).json({ message: 'Failed to fetch ads' });
  }
};

const toggleAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });

    if (ad.status === "ACTIVE") {
      ad.status = "PENDING_APPROVAL";
    } else {
      ad.status = "ACTIVE";
      ad.startDate = new Date();
      const end = new Date();
      end.setDate(ad.startDate.getDate() + ad.durationDays);
      ad.endDate = end;
    }

    await ad.save();
    res.status(200).json(ad);
  } catch (error) {
    console.error('toggleAd error:', error.message);
    res.status(500).json({ message: 'Failed to toggle ad status' });
  }
};

const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });

    if (ad.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(ad.cloudinaryPublicId);
    }

    await Ad.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error('deleteAd error:', error.message);
    res.status(500).json({ message: 'Failed to delete ad' });
  }
};

export default { createAd, getAds, toggleAd, deleteAd };
