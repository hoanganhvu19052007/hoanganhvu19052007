import re
import random
from datetime import datetime, timezone, timedelta

# ═══════════════════════════════════════════════════════════
# 🎮 GAMING/RGB REALTIME UPDATE SCRIPT (Python version)
# ═══════════════════════════════════════════════════════════

QUOTES = [
    (""Any fool can write code that a computer can understand. Good programmers write code that humans can understand."", "Martin Fowler"),
    (""First, solve the problem. Then, write the code."", "John Johnson"),
    (""Experience is the name everyone gives to their mistakes."", "Oscar Wilde"),
    (""Code is like humor. When you have to explain it, it's bad."", "Cory House"),
    (""Simplicity is prerequisite for reliability."", "Edsger W. Dijkstra"),
    (""Make it work, make it right, make it fast."", "Kent Beck"),
    (""The best error message is the one that never shows up."", "Thomas Fuchs"),
    (""Architecture is about the important stuff. Whatever that is."", "Ralph Johnson"),
    (""Programs must be written for people to read, and only incidentally for machines to execute."", "Harold Abelson"),
    (""Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."", "Antoine de Saint-Exupéry"),
    (""The only way to do great work is to love what you do."", "Steve Jobs"),
    (""Talk is cheap. Show me the code."", "Linus Torvalds"),
    (""It's not a bug — it's an undocumented feature."", "Anonymous"),
    (""The best time to plant a tree was 20 years ago. The second best time is now."", "Chinese Proverb"),
    (""In the middle of difficulty lies opportunity."", "Albert Einstein"),
]

def get_vietnam_time():
    tz_vietnam = timezone(timedelta(hours=7))
    return datetime.now(tz_vietnam)

def get_greeting(hour: int) -> str:
    if 5 <= hour < 12:
        return "🌅 <b>Chào buổi sáng!</b> Chúc bạn một ngày mới tràn đầy năng lượng & sáng tạo!"
    elif 12 <= hour < 18:
        return "☀️ <b>Chào buổi chiều!</b> Chúc bạn làm việc hiệu quả & giải quyết bài toán mượt mà!"
    elif 18 <= hour < 23:
        return "🌆 <b>Chào buổi tối!</b> Chúc bạn có thời gian thư giãn tuyệt vời!"
    else:
        return "🌙 <b>Cú đêm coding!</b> Đừng quên giữ gìn sức khỏe và nghỉ ngơi hợp lý nhé!"

def get_season(month: int) -> dict:
    if 3 <= month <= 5:
        return {"name": "Xuân 🌸", "emoji": "🌸"}
    elif 6 <= month <= 8:
        return {"name": "Hè ☀️", "emoji": "☀️"}
    elif 9 <= month <= 11:
        return {"name": "Thu 🍂", "emoji": "🍂"}
    else:
        return {"name": "Đông ❄️", "emoji": "❄️"}

def get_day_name(weekday: int) -> str:
    days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"]
    return days[weekday]

def url_encode_badge(text: str) -> str:
    """Encode text for shields.io badge labels"""
    import urllib.parse
    encoded = urllib.parse.quote(text, safe='')
    return encoded.replace("-", "--")

def generate_realtime_content() -> str:
    now = get_vietnam_time()
    greeting = get_greeting(now.hour)
    season = get_season(now.month)
    day_str = get_day_name(now.weekday())
    time_str = now.strftime("%H:%M:%S")
    date_str = now.strftime("%d/%m/%Y")

    quote_text, quote_author = random.choice(QUOTES)

    # URL encoded badges
    time_badge = url_encode_badge(f"{time_str} (GMT+7)")
    date_badge = url_encode_badge(f"{day_str}, {date_str}")
    season_badge = url_encode_badge(season["name"])

    content = f"""<!-- REALTIME_START -->
<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/🟢_TRẠNG_THÁI-ĐANG_HOẠT_ĐỘNG-00FF88?style=flat-square&labelColor=0D1117" alt="Live Status" />
        &nbsp;
        <img src="https://img.shields.io/badge/⏰_GIỜ_VIỆT_NAM-{time_badge}-00D4FF?style=flat-square&labelColor=0D1117" alt="Vietnam Time" />
        &nbsp;
        <img src="https://img.shields.io/badge/📅_NGÀY-{date_badge}-7928CA?style=flat-square&labelColor=0D1117" alt="Date" />
        &nbsp;
        <img src="https://img.shields.io/badge/🌡️_MÙA-{season_badge}-FF6B35?style=flat-square&labelColor=0D1117" alt="Season" />
        <br/><br/>
        <p><i>{greeting}</i></p>
        <p>💡 {quote_text} — <b>{quote_author}</b></p>
        <sub style="color: #94A3B8;">⚡ Tự động cập nhật mỗi giờ qua GitHub Actions • Cập nhật lần cuối: <b>{date_str} {time_str} (GMT+7)</b></sub>
      </td>
    </tr>
  </table>
</div>
<!-- REALTIME_END -->"""
    return content

def update_readme():
    readme_path = "README.md"
    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    new_realtime_block = generate_realtime_content()
    pattern = r"<!-- REALTIME_START -->.*?<!-- REALTIME_END -->"

    if re.search(pattern, content, flags=re.DOTALL):
        updated_content = re.sub(pattern, new_realtime_block, content, flags=re.DOTALL)
    else:
        if "</div>\n\n---" in content:
            updated_content = content.replace("</div>\n\n---", f"</div>\n\n{new_realtime_block}\n\n---", 1)
        else:
            updated_content = new_realtime_block + "\n\n" + content

    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(updated_content)

    now = get_vietnam_time()
    print(f"🎮 ✅ Successfully updated README.md with Gaming/RGB real-time stats!")
    print(f"⏰ Vietnam Time: {now.strftime('%H:%M:%S')} (GMT+7)")
    print(f"📅 Date: {get_day_name(now.weekday())}, {now.strftime('%d/%m/%Y')}")

if __name__ == "__main__":
    update_readme()
