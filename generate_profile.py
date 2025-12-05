"""
Reads profile.json and generates profile.html (a standalone HTML file).
Run: python generate_profile.py
"""

import json
from pathlib import Path

def render(profile):
    html = f"""
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{profile['name']} — Profile</title>
<style>
body{{font-family:Arial,Helvetica,sans-serif;background:#f7f9fb;margin:0;padding:24px;color:#0f172a}}
.container{{max-width:900px;margin:0 auto;background:#fff;padding:20px;border-radius:12px}}
h1{{margin-top:0}}
</style>
</head>
<body>
<div class="container">
<h1>{profile['name']}</h1>
<p><strong>{profile['headline']}</strong></p>
<p>{profile['summary']}</p>

<h2>Contact</h2>
<ul>
<li>Email: {profile['contact']['email']}</li>
<li>Phone: {profile['contact']['phone']}</li>
<li>Location: {profile['contact']['location']}</li>
</ul>

<h2>Specialties</h2>
<ul>
"""
    for s in profile.get("specialties", []):
        html += f"<li>{s}</li>\n"

    html += "</ul>\n<h2>Experience</h2>\n"

    for e in profile.get("experience", []):
        html += f"<h3>{e['role']} — {e['company']}</h3>\n<p>{e['period']} | {e.get('location','')}</p>\n<p>{e['details']}</p>\n"

    html += f"""
<p>{profile.get("closing","")}</p>
</div>
</body>
</html>
"""
    return html

if __name__ == "__main__":
    p = Path("profile.json")
    if not p.exists():
        print("profile.json not found.")
    else:
        profile = json.loads(p.read_text())
        Path("profile.html").write_text(render(profile), encoding="utf-8")
        print("profile.html generated successfully.")
