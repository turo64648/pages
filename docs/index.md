---
title: Pages
aside: false
---

<script setup>
import { withBase } from 'vitepress'
import { data as pages } from './pages.data'
</script>

# Pages

Explainers, notes and other pages, newest first.

<ul class="page-list">
  <li v-for="p in pages" :key="p.url">
    <time>{{ p.date }}</time>
    <div>
      <a :href="withBase(p.url)">{{ p.title }}</a>
      <p v-if="p.description">{{ p.description }}</p>
    </div>
  </li>
</ul>
