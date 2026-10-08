const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════
// 🎮 GAMING/RGB REALTIME UPDATE SCRIPT
// ═══════════════════════════════════════════════════════════

const QUOTES = [
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Architecture is about the important stuff. Whatever that is.", author: "Ralph Johnson" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "It's not a bug — it's an undocumented feature.", author: "Anonymous" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
];

function getVietnamDate() {
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utcTime + (7 * 3600000));
}

function getGreeting(hour) {
  if (hour >= 5 && hour < 12) {
    return "🌅 <b>Chào buổi sáng!</b> Chúc bạn một ngày mới tràn đầy năng lượng & sáng tạo!";
  } else if (hour >= 12 && hour < 18) {
    return "☀️ <b>Chào buổi chiều!</b> Chúc bạn làm việc hiệu quả & giải quyết bài toán mượt mà!";
  } else if (hour >= 18 && hour < 23) {
    return "🌆 <b>Chào buổi tối!</b> Chúc bạn có thời gian thư giãn tuyệt vời!";
  } else {
    return "🌙 <b>Cú đêm coding!</b> Đừng quên giữ gìn sức khỏe và nghỉ ngơi hợp lý nhé!";
  }
}

function getSeason(month) {
  if (month >= 3 && month <= 5) return { name: "Xuân 🌸", emoji: "🌸" };
  if (month >= 6 && month <= 8) return { name: "Hè ☀️", emoji: "☀️" };
  if (month >= 9 && month <= 11) return { name: "Thu 🍂", emoji: "🍂" };
  return { name: "Đông ❄️", emoji: "❄️" };
}

function getDayName(dayIndex) {
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  return days[dayIndex];
}

function padZero(num) {
  return String(num).padStart(2, '0');
}

function generateRealtimeContent() {
  const vnTime = getVietnamDate();
  const hours = vnTime.getHours();
  const month = vnTime.getMonth() + 1;
  const greeting = getGreeting(hours);
  const season = getSeason(month);
  const dayStr = getDayName(vnTime.getDay());

  const timeStr = `${padZero(hours)}:${padZero(vnTime.getMinutes())}:${padZero(vnTime.getSeconds())}`;
  const dateStr = `${padZero(vnTime.getDate())}/${padZero(month)}/${vnTime.getFullYear()}`;

  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  // URL encode for shields.io badges
  const timeBadge = encodeURIComponent(`${timeStr} (GMT+7)`).replace(/-/g, '--');
  const dateBadge = encodeURIComponent(`${dayStr}, ${dateStr}`).replace(/-/g, '--');
  const seasonBadge = encodeURIComponent(season.name).replace(/-/g, '--');

  return `<!-- REALTIME_START -->
<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/🟢_TRẠNG_THÁI-ĐANG_HOẠT_ĐỘNG-00FF88?style=flat-square&labelColor=0D1117" alt="Live Status" />
        &nbsp;
        <img src="https://img.shields.io/badge/⏰_GIỜ_VIỆT_NAM-${timeBadge}-00D4FF?style=flat-square&labelColor=0D1117" alt="Vietnam Time" />
        &nbsp;
        <img src="https://img.shields.io/badge/📅_NGÀY-${dateBadge}-7928CA?style=flat-square&labelColor=0D1117" alt="Date" />
        &nbsp;
        <img src="https://img.shields.io/badge/🌡️_MÙA-${seasonBadge}-FF6B35?style=flat-square&labelColor=0D1117" alt="Season" />
        <br/><br/>
        <p><i>${greeting}</i></p>
        <p>💡 "${randomQuote.text}" — <b>${randomQuote.author}</b></p>
        <sub style="color: #94A3B8;">⚡ Tự động cập nhật mỗi giờ qua GitHub Actions • Cập nhật lần cuối: <b>${dateStr} ${timeStr} (GMT+7)</b></sub>
      </td>
    </tr>
  </table>
</div>
<!-- REALTIME_END -->`;
}

function updateReadme() {
  const readmePath = path.join(__dirname, '..', 'README.md');
  let content = fs.readFileSync(readmePath, 'utf8');

  const newRealtimeBlock = generateRealtimeContent();
  const pattern = /<!-- REALTIME_START -->[\s\S]*?<!-- REALTIME_END -->/;

  if (pattern.test(content)) {
    content = content.replace(pattern, newRealtimeBlock);
  } else {
    if (content.includes('</div>\n\n---')) {
      content = content.replace('</div>\n\n---', `</div>\n\n${newRealtimeBlock}\n\n---`);
    } else {
      content = `${newRealtimeBlock}\n\n${content}`;
    }
  }

  fs.writeFileSync(readmePath, content, 'utf8');
  
  const vnTime = getVietnamDate();
  console.log(`🎮 ✅ Successfully updated README.md with Gaming/RGB real-time stats!`);
  console.log(`⏰ Vietnam Time: ${padZero(vnTime.getHours())}:${padZero(vnTime.getMinutes())}:${padZero(vnTime.getSeconds())} (GMT+7)`);
  console.log(`📅 Date: ${getDayName(vnTime.getDay())}, ${padZero(vnTime.getDate())}/${padZero(vnTime.getMonth() + 1)}/${vnTime.getFullYear()}`);
}

updateReadme();
