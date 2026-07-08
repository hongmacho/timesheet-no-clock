#!/usr/bin/env node

import Database from "better-sqlite3";

const dbPath = process.env.DATABASE_PATH || "./timesheet.db";
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

console.log("🌱 Seeding timesheet database...");
console.log(`📁 Database path: ${dbPath}`);

try {
  const now = Math.floor(Date.now() / 1000);

  // 1. Insert user
  console.log("\n👤 Inserting user...");
  db.exec(`
    INSERT INTO users (name, email, phone, company_name, currency, created_at, updated_at)
    VALUES ('김홍필', 'hong@example.com', '010-1234-5678', '디자인스튜디오', 'KRW', ${now}, ${now})
  `);

  // 2. Insert projects (4+)
  console.log("📋 Inserting projects...");
  const projects = [
    { name: "디자인", rate: 50000, description: "UI/UX 디자인 프로젝트" },
    { name: "개발", rate: 60000, description: "웹 개발 프로젝트" },
    { name: "마케팅", rate: 40000, description: "마케팅 캠페인" },
    { name: "컨설팅", rate: 70000, description: "기술 컨설팅" },
  ];

  for (const proj of projects) {
    db.exec(`
      INSERT INTO projects (user_id, name, hourly_rate, description, status, created_at, updated_at)
      VALUES (1, '${proj.name}', ${proj.rate}, '${proj.description}', 'active', ${now}, ${now})
    `);
  }

  // 3. Insert time entries (20+)
  console.log("⏱️  Inserting time entries...");

  const timeEntries = [
    // This week
    { date: "2026-07-09", projectId: 1, hours: 2, notes: "로고 디자인 시작" },
    { date: "2026-07-09", projectId: 2, hours: 3, notes: "API 개발" },
    { date: "2026-07-09", projectId: 3, hours: 1.5, notes: "SNS 마케팅" },

    { date: "2026-07-08", projectId: 1, hours: 4, notes: "UI 프로토타입" },
    { date: "2026-07-08", projectId: 2, hours: 2.5, notes: "버그 수정" },

    { date: "2026-07-07", projectId: 4, hours: 3, notes: "클라이언트 미팅" },
    { date: "2026-07-07", projectId: 1, hours: 2, notes: "색상 팔레트 선정" },

    { date: "2026-07-06", projectId: 3, hours: 2, notes: "이메일 캠페인" },
    { date: "2026-07-06", projectId: 2, hours: 3.5, notes: "데이터베이스 최적화" },

    { date: "2026-07-05", projectId: 2, hours: 4, notes: "백엔드 리팩토링" },
    { date: "2026-07-05", projectId: 1, hours: 1.5, notes: "디자인 검토" },

    // Last week
    { date: "2026-07-04", projectId: 4, hours: 2, notes: "기술 자문" },
    { date: "2026-07-04", projectId: 3, hours: 3, notes: "콘텐츠 마케팅" },

    { date: "2026-07-03", projectId: 1, hours: 2.5, notes: "목업 디자인" },
    { date: "2026-07-03", projectId: 2, hours: 3, notes: "테스트 작성" },

    { date: "2026-07-02", projectId: 2, hours: 2, notes: "코드 리뷰" },
    { date: "2026-07-02", projectId: 1, hours: 1.5, notes: "클라이언트 회의" },

    { date: "2026-07-01", projectId: 3, hours: 2, notes: "광고 캠페인 준비" },
    { date: "2026-07-01", projectId: 2, hours: 4, notes: "새 기능 개발" },

    { date: "2026-06-30", projectId: 1, hours: 3, notes: "최종 디자인 확정" },
    { date: "2026-06-30", projectId: 4, hours: 2.5, notes: "아키텍처 컨설팅" },
  ];

  for (const entry of timeEntries) {
    db.exec(`
      INSERT INTO time_entries (user_id, project_id, date, hours, notes, source, created_at, updated_at)
      VALUES (1, ${entry.projectId}, '${entry.date}', ${entry.hours}, '${entry.notes}', 'manual', ${now}, ${now})
    `);
  }

  // Verify data
  console.log("\n✨ Verifying data...");
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
  const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects").get().count;
  const entryCount = db.prepare("SELECT COUNT(*) as count FROM time_entries").get().count;

  console.log(`   Users: ${userCount}`);
  console.log(`   Projects: ${projectCount}`);
  console.log(`   Time Entries: ${entryCount}`);

  console.log("\n🎉 Seeding completed successfully!");
  console.log(JSON.stringify({
    seed: {
      ok: true,
      counts: {
        users: userCount,
        projects: projectCount,
        timeEntries: entryCount,
      },
    },
  }, null, 2));
} catch (error) {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
} finally {
  db.close();
}
