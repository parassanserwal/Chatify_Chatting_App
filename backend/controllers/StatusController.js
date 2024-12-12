import Status from "../models/StatusModel.js";
import fs from 'fs';
import {mkdirSync, renameSync} from "fs";
export const createStatus = async (req, res) => {
  try {
    const date=Date.now();
    const { uploader, type, content } = req.body;
    
    let imageUrl = null;
    if (type === 'image' && req.file) {
        let fileDir = `uploads/files/${date}`
        let fileName = `${fileDir}/${req.file.originalname}`
  
        mkdirSync(fileDir,{recursive:true});
        renameSync(req.file.path, fileName );
  
      
        imageUrl = `/uploads/files/${date}/${req.file.originalname}`;
    }
    const createdAt = new Date();
   
    const expiresAt = new Date(createdAt.getTime() + 30 * 1000);
    const newStatus = new Status({
      uploader,
      type,
      content: type === 'text' ? content : null,
      imageUrl,
      expiresAt
    });

    await newStatus.save();
    res.status(201).json({ message: 'Status created successfully', status: newStatus });
  } catch (error) {
    console.error('Error creating status:', error);
    res.status(500).json({ message: 'Failed to create status' });
  }
};

export const getAllStatuses = async (req, res) => {
    try {
      const statuses = await Status.find().populate('uploader', 'firstName lastName').sort({ timestamp: -1 });
      res.status(200).json(statuses);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      res.status(500).json({ message: 'Failed to fetch statuses' });
    }
  };