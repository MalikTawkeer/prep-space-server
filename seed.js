require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const User = require('./models/user.model');
const Category = require('./models/category.model');
const Subject = require('./models/subject.model');
const Chapter = require('./models/chapter.model');

async function seed() {
  console.log('[Seed] Connecting to database...');
  await connectDB();

  try {
    // 1. Ensure Admin User exists
    let admin = await User.findOne({ email: 'admin@prepspace.com' });
    if (!admin) {
      admin = new User({
        name: 'PrepSpace Administrator',
        email: 'admin@prepspace.com',
        password: 'AdminPassword123!',
        role: 'admin',
        isActive: true,
      });
      await admin.save();
      console.log('[Seed] Admin user created: admin@prepspace.com / AdminPassword123!');
    } else {
      console.log('[Seed] Admin user already exists: admin@prepspace.com');
    }

    // 2. Ensure Categories exist
    const categoryConfigs = [
      {
        title: 'Medical & Health Physics',
        subtitle: 'Nuclear Medicine · Radiation Safety · RSO',
        examId: 'nuc-med-rso',
        icon: 'atom-variant',
        color: 'orange',
        order: 1,
      },
      {
        title: 'Civil Services',
        subtitle: 'UPSC · State Public Services',
        examId: 'upsc-cse',
        icon: 'bank-outline',
        color: 'green',
        order: 2,
      },
      {
        title: 'Engineering Entrance',
        subtitle: 'JEE Main · JEE Advanced',
        examId: 'jee',
        icon: 'calculator-variant-outline',
        color: 'blue',
        order: 3,
      },
      {
        title: 'Medical Entrance',
        subtitle: 'NEET UG',
        examId: 'neet',
        icon: 'flask-outline',
        color: 'purple',
        order: 4,
      },
    ];

    for (const catConf of categoryConfigs) {
      let category = await Category.findOne({ title: catConf.title });
      if (!category) {
        category = new Category(catConf);
        await category.save();
        console.log(`[Seed] Created category: ${category.title}`);
      }

      // 3. Ensure Subjects & Chapters for Medical & Health Physics
      if (category.title === 'Medical & Health Physics') {
        let subject = await Subject.findOne({
          categoryId: category._id,
          title: 'Radiation Safety & Nuclear Medicine',
        });
        if (!subject) {
          subject = new Subject({
            categoryId: category._id,
            title: 'Radiation Safety & Nuclear Medicine',
            description: 'Radiation protection, radionuclide decay, detectors, and clinical physics',
            examId: 'nuc-med-rso',
            icon: 'radioactive',
            order: 1,
          });
          await subject.save();
          console.log(`[Seed] Created subject: ${subject.title}`);
        }

        const chaptersList = [
          {
            title: 'Flash Facts Radiation Safety',
            description: 'Exposure limits, CFR regulations, package surveys, and spill procedures',
            chapterNumber: 1,
          },
          {
            title: 'Radionuclide Decay',
            description: 'Decay modes, half-lives, gamma energies, and isotope production methods',
            chapterNumber: 2,
          },
          {
            title: 'Detectors & Quality Control',
            description: 'Scintillation detectors, CZT, survey meters, and equipment QC protocols',
            chapterNumber: 3,
          },
          {
            title: 'EKG & Clinical Flash Facts',
            description: 'Leads, axis determination, intervals, and rate calculations',
            chapterNumber: 4,
          },
        ];

        for (const ch of chaptersList) {
          let chapter = await Chapter.findOne({
            subjectId: subject._id,
            title: ch.title,
          });
          if (!chapter) {
            chapter = new Chapter({
              subjectId: subject._id,
              categoryId: category._id,
              title: ch.title,
              description: ch.description,
              examId: 'nuc-med-rso',
              chapterNumber: ch.chapterNumber,
            });
            await chapter.save();
            console.log(`[Seed] Created chapter: ${chapter.title}`);
          }
        }
      }
    }

    console.log('[Seed] Database seeding completed successfully! ✨');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
}

seed();

