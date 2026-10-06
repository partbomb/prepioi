import json
import os
import glob

def get_difficulty_emoji(diff):
    if diff == 'easy': return '🟢 Легкая'
    if diff == 'medium': return '🟡 Средняя'
    if diff == 'hard': return '🔴 Сложная'
    return diff

def main():
    topics_dir = "/home/kuanysh/Documents/Kuanysh/traincpp/topics/"
    contest_file = "/home/kuanysh/Documents/Kuanysh/traincpp/contests/starting_contest.json"
    readme_file = "/home/kuanysh/Documents/Kuanysh/traincpp/README.md"
    
    with open(contest_file, 'r', encoding='utf-8') as f:
        contest = json.load(f)
        
    topic_files = sorted(glob.glob(os.path.join(topics_dir, "*.json")))
    
    topics = []
    for tf in topic_files:
        with open(tf, 'r', encoding='utf-8') as f:
            topics.append(json.load(f))
            
    lines = []
    lines.append("# CP-Roadmap — Навигатор по олимпиадному программированию\n")
    lines.append("Это дорожная карта (roadmap) для изучения спортивного программирования. Это НЕ базовый курс по синтаксису языка, а навигатор, который подскажет, какие алгоритмические темы изучать и какие задачи решать для прокачки своих навыков.\n")
    
    lines.append("## 🎓 Не знаешь основ C++?")
    lines.append("Если ты только начинаешь и не знаешь синтаксис C++, рекомендуем пройти базовый курс на Stepik: [https://stepik.org/course/363/promo](https://stepik.org/course/363/promo)\n")
    
    lines.append("## 📋 Оглавление")
    for i, t in enumerate(topics, 1):
        # GitHub markdown anchors are lowercase and spaces replaced with dashes
        anchor = f"тема-{i}-{t['name'].lower().replace(' ', '-')}"
        lines.append(f"- [{t['icon']} Тема {i}: {t['name']}](#{anchor})")
    lines.append("")
    
    lines.append("## 📊 Диагностический контест")
    lines.append("Ниже представлены задачи для проверки начального уровня.")
    lines.append("| # | Задача | Рейтинг | Тема |")
    lines.append("|---|---|---|---|")
    for t in contest['tasks']:
        lines.append(f"| {t['index']} | [{t['name']}]({t['url']}) | {t.get('rating', '')} | {t.get('topic', '')} |")
    lines.append("\n---")
    
    tiers = {
        1: "Уровень 1 (Базовый)",
        2: "Уровень 2 (Средний)",
        3: "Уровень 3 (Продвинутый)"
    }
    
    current_tier = None
    
    for i, t in enumerate(topics, 1):
        tier = t.get('tier', 1)
        if tier != current_tier:
            current_tier = tier
            lines.append(f"\n## 🏆 {tiers[current_tier]}\n")
            
        lines.append(f"## {t['icon']} Тема {i}: {t['name']}")
        lines.append("### 🎯 Цель")
        lines.append(f"Изучить тему {t['name']} и закрепить на практике.\n")
        
        lines.append("### 📖 Теория")
        theory_title = t['theory']['title']
        theory_text = t['theory']['explanation']
        lines.append(f"**{theory_title}**\n")
        lines.append(theory_text.replace("\\n", "\n") + "\n")
        
        lines.append("### 💻 Шаблон кода")
        lines.append("```cpp")
        lines.append(t['theory']['codeTemplate'].replace("\\n", "\n"))
        lines.append("```\n")
        
        lines.append("### ✨ Ключевые моменты")
        for kp in t['theory']['keyPoints']:
            lines.append(f"- {kp}")
        lines.append("")
        
        lines.append("### ✅ Задачи")
        lines.append("| # | Задача | Сложность | Ссылка |")
        lines.append("|---|---|---|---|")
        for j, task in enumerate(t['tasks'], 1):
            diff = get_difficulty_emoji(task.get('difficulty', ''))
            lines.append(f"| {j} | {task['name']} | {diff} | [Решать на {task['platform']}]({task['url']}) |")
        lines.append("")
        
        lines.append("### 💡 Подсказки")
        for j, task in enumerate(t['tasks'], 1):
            if 'hint' in task:
                lines.append(f"<details><summary>Подсказка к задаче {j} ({task['name']})</summary>")
                lines.append(f"\n{task['hint']}\n")
                lines.append("</details>")
        lines.append("\n---")

    with open(readme_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines) + "\n")
        
if __name__ == '__main__':
    main()
