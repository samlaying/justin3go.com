import path from "node:path";
import { writeFileSync } from "node:fs";
import { Feed } from "feed";
import { createContentLoader, type SiteConfig } from "vitepress";

const hostname = "https://justin3go.com";

export async function createRssFileZH(config: SiteConfig) {
  const feed = new Feed({
    title: 'sam',
    description: '经济学本科在读，AI 产品经理实习中，关注 AI 与产品设计，在这里记录学习与思考',
    id: hostname,
    link: hostname,
    language: "zh-Hans",
    image: "https://oss.justin3go.com/justin3goAvatar.jpg",
    favicon: `https://oss.justin3go.com/justin3goAvatar.ico`,
    copyright: "Copyright© 2021-present sam",
  });

  const posts = await createContentLoader("posts/**/*.md", {
    excerpt: true,
    render: true,
  }).load();

  posts.sort((a, b) => Number(+new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)));

  for (const { url, excerpt, html, frontmatter } of posts) {
    // 仅保留最近 5 篇文章
    if (feed.items.length >= 5) {
      break;
    }

    feed.addItem({
      title: frontmatter.title,
      id: `${hostname}${url}`,
      link: `${hostname}${url}`,
      description: excerpt,
      content: html,
      author: [
        {
          name: "sam",
          email: "just@justin3go.com",
          link: "https://justin3go.com",
        },
      ],
      date: frontmatter.date,
    });
  }

  writeFileSync(path.join(config.outDir, "feed.xml"), feed.rss2(), "utf-8");
}

export async function createRssFileEN(config: SiteConfig) {
  const feed = new Feed({
    title: "sam",
    description: "An economics undergraduate interning as an AI product manager, curious about AI and product design, documenting what I learn along the way.",
    id: hostname,
    link: hostname,
    language: "en-US",
    image: "https://oss.justin3go.com/justin3goAvatar.jpg",
    favicon: `https://oss.justin3go.com/justin3goAvatar.ico`,
    copyright: "Copyright© 2021-present sam",
  });

  const posts = await createContentLoader("en/posts/**/*.md", {
    excerpt: true,
    render: true,
  }).load();

  posts.sort((a, b) => Number(+new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)));

  for (const { url, excerpt, html, frontmatter } of posts) {
    // 仅保留最近 5 篇文章
    if (feed.items.length >= 5) {
      break;
    }

    feed.addItem({
      title: frontmatter.title,
      id: `${hostname}${url}`,
      link: `${hostname}${url}`,
      description: excerpt,
      content: html,
      author: [
        {
          name: "sam",
          email: "just@justin3go.com",
          link: "https://justin3go.com",
        },
      ],
      date: frontmatter.date,
    });
  }

  writeFileSync(path.join(config.outDir, "feed-en.xml"), feed.rss2(), "utf-8");
}
