# 📚 Article Lessons + Course Metadata Setup

Complete guide to enable written lessons with MDX + LaTeX support and course metadata.

## 🚀 Quick Setup (5 minutes)

### 1. Run Database Migration

Go to **Supabase Dashboard → SQL Editor** and run:

```bash
sql/add_course_metadata_and_article_type.sql
```

This will:
- ✅ Add `course_metadata` JSONB column to `courses` table
- ✅ Add `article` type to `course_resources`
- ✅ Add `mdx_content`, `reading_time_minutes`, `word_count` columns
- ✅ Create constraints and indexes

### 2. Verify Installation

Packages are already installed:
- ✅ `next-mdx-remote`
- ✅ `remark-math`
- ✅ `rehype-katex`
- ✅ `remark-gfm`

KaTeX CSS is already added to `app/globals.css`:
```css
@import url('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css');
```

### 3. Test It Out!

1. Go to **My Courses** → Edit a course
2. Click **Content & Syllabus** tab
3. Add a new week
4. Select **Lesson Type: Written Article (MDX + LaTeX)**
5. Write some content:

```mdx
# Introduction to Calculus

The derivative of a function $f(x)$ represents the rate of change.

## Definition

$$
f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

## Example

For $f(x) = x^2$:

$$
f'(x) = 2x
$$
```

6. Save and view the lesson!

## 📖 Features

### Course Metadata (Course Details Tab)

Three new sections in the course editor:

1. **About the Course**
   - Detailed course description
   - Stored in `courses.course_metadata.about`

2. **What You Will Learn**
   - List of learning outcomes
   - Stored in `courses.course_metadata.what_you_will_learn[]`

3. **Key Points by Section**
   - Organized by course sections
   - Each section has multiple points
   - Stored in `courses.course_metadata.key_points[]`

### Article Lessons (Content & Syllabus Tab)

**Lesson Types:**
- 📹 **Video Lesson**: Upload video + description
- 📝 **Article Lesson**: MDX editor with LaTeX support

**Article Features:**
- Full Markdown support
- LaTeX math (inline `$` and block `$$`)
- Code blocks with syntax highlighting
- Tables, lists, quotes
- GitHub Flavored Markdown
- Dark mode support
- Responsive design

## 📊 Database Schema

### courses.course_metadata (JSONB)

```json
{
  "about": "Course description...",
  "what_you_will_learn": [
    "Outcome 1",
    "Outcome 2"
  ],
  "key_points": [
    {
      "section": "Section 1",
      "points": ["Point 1", "Point 2"]
    }
  ]
}
```

### courses.syllabus (JSONB)

```json
[
  {
    "week": 1,
    "title": "Introduction",
    "type": "article",
    "mdx_content": "# Title\n\n$$math$$",
    "topics": ["Topic 1"],
    "locked": false
  },
  {
    "week": 2,
    "title": "Advanced Topics",
    "type": "video",
    "video_url": "course-videos:path/to/video.mp4",
    "content": "Video description",
    "topics": ["Topic 2"],
    "locked": false
  }
]
```

## 🎨 UI Components

### MDX Renderer (`components/mdx/mdx-renderer.tsx`)

Automatically renders:
- Markdown → HTML
- LaTeX → Beautiful math equations
- Code → Syntax highlighted blocks
- Tables → Styled tables

### Course Learning Page

**Video Lesson:**
- Custom video player
- Progress tracking
- Mark complete (>95% watched)

**Article Lesson:**
- Clean reading layout
- Sticky header with title
- Mark complete button (always visible)
- Scrollable content
- Max-width for readability

## 📝 MDX Syntax Examples

### Headings
```mdx
# Heading 1
## Heading 2
### Heading 3
```

### Text Formatting
```mdx
**Bold text**
*Italic text*
~~Strikethrough~~
`inline code`
```

### Lists
```mdx
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

### Math (LaTeX)
```mdx
Inline math: $f(x) = x^2$

Block math:
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

### Code Blocks
````mdx
```javascript
function hello() {
  console.log('Hello, World!');
}
```
````

### Tables
```mdx
| Function | Derivative |
|----------|------------|
| $x^n$ | $nx^{n-1}$ |
| $e^x$ | $e^x$ |
```

### Links
```mdx
[Link text](https://example.com)
```

### Images
```mdx
![Alt text](image-url.jpg)
```

## 🔧 Troubleshooting

### Migration Fails

If you get "column already exists" errors, that's OK! The migration is idempotent.

### Math Not Rendering

1. Check KaTeX CSS is loaded (inspect browser console)
2. Verify LaTeX syntax is correct
3. Use `$` for inline, `$$` for block

### Article Not Showing

1. Verify lesson type is set to `'article'`
2. Check `mdx_content` field has content
3. Look for errors in browser console

## 📚 Resources

- [MDX Documentation](https://mdxjs.com/)
- [KaTeX Supported Functions](https://katex.org/docs/supported.html)
- [Markdown Guide](https://www.markdownguide.org/)
- [LaTeX Math Symbols](https://www.overleaf.com/learn/latex/List_of_Greek_letters_and_math_symbols)

## ✅ Checklist

- [ ] Run SQL migration
- [ ] Verify packages installed
- [ ] Test course metadata (Course Details tab)
- [ ] Test article lesson creation
- [ ] Test LaTeX rendering
- [ ] Test on mobile

## 🎉 You're Done!

Your platform now supports:
- ✅ Video lessons with custom player
- ✅ Written articles with MDX + LaTeX
- ✅ Rich course metadata
- ✅ Professional reading experience
- ✅ Mobile responsive

Happy teaching! 🎓

