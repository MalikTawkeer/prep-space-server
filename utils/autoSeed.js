const Category = require('../models/category.model');
const Subject = require('../models/subject.model');
const Chapter = require('../models/chapter.model');
const Question = require('../models/question.model');

async function ensureDefaultData() {
  try {
    const catCount = await Category.countDocuments();
    if (catCount > 0) return;

    console.log('[AutoSeed] Database is empty. Seeding initial categories, subjects, and chapters...');

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
      const cat = new Category(catConf);
      await cat.save();

      if (cat.title === 'Medical & Health Physics') {
        const sub = new Subject({
          categoryId: cat._id,
          title: 'Radiation Safety & Nuclear Medicine',
          description: 'Radiation protection, radionuclide decay, detectors, and equipment QC',
          examId: 'nuc-med-rso',
          icon: 'radioactive',
          order: 1,
        });
        await sub.save();

        const chaps = [
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

        for (const ch of chaps) {
          const chap = new Chapter({
            subjectId: sub._id,
            categoryId: cat._id,
            title: ch.title,
            description: ch.description,
            examId: 'nuc-med-rso',
            chapterNumber: ch.chapterNumber,
          });
          await chap.save();
        }
      } else if (cat.title === 'Civil Services') {
        const sub = new Subject({
          categoryId: cat._id,
          title: 'Indian Polity & Governance',
          description: 'Constitution, fundamental rights, and political system',
          examId: 'upsc-cse',
          icon: 'scale-balance',
          order: 1,
        });
        await sub.save();

        const chap = new Chapter({
          subjectId: sub._id,
          categoryId: cat._id,
          title: 'Fundamental Rights & Duties',
          description: 'Articles 12-35, writs, and constitutional remedies',
          chapterNumber: 1,
        });
        await chap.save();
      }
    }

    console.log('[AutoSeed] Completed initial seed successfully!');
  } catch (err) {
    console.error('[AutoSeed] Error auto-seeding:', err.message);
  }
}

module.exports = { ensureDefaultData };

