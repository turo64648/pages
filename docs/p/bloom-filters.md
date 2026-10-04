---
title: Bloom Filters
date: 2026-10-04
description: Answer "have I seen this before?" in a few bits per item, at the cost of rare false alarms.
---

<script setup>
import { ref, computed } from 'vue'

const M = 32, K = 3
const bits = ref(Array(M).fill(0))
const added = ref([])
const word = ref('')
const result = ref(null)

// Three cheap hashes from one FNV-1a variant with different seeds. Fine for a demo, not for production.
function positions(s) {
  return [0x811c9dc5, 0x01000193, 0x5bd1e995].map((seed) => {
    let h = seed
    for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0
    return h % M
  })
}
const current = computed(() => (word.value ? positions(word.value.trim().toLowerCase()) : []))

function add() {
  const w = word.value.trim().toLowerCase()
  if (!w) return
  for (const p of positions(w)) bits.value[p] = 1
  if (!added.value.includes(w)) added.value.push(w)
  result.value = { kind: 'added', w }
}
function check() {
  const w = word.value.trim().toLowerCase()
  if (!w) return
  const hit = positions(w).every((p) => bits.value[p])
  const real = added.value.includes(w)
  result.value = { kind: hit ? (real ? 'yes' : 'false') : 'no', w }
}
function reset() {
  bits.value = Array(M).fill(0)
  added.value = []
  result.value = null
}
</script>

# Bloom Filters

A Bloom filter answers "have I seen this before?" using a few bits per item, no matter how big the items are.
The price is that it sometimes says "maybe" when the true answer is "no", but it never says "no" by mistake.

## The idea

**In short:** keep a row of bits. Adding an item sets a few of them; checking an item looks at the same few.

Say you run a website and want to know whether a username is taken. Storing every username takes memory, and
looking one up may need a database call. Instead, keep a row of bits, all starting at zero.

To **add** a name, run it through a few different hash functions. Each one turns the name into a position in
the row. Set those bits to one. To **check** a name, compute the same positions and look at the bits:

- If any of them is zero, this name was never added. That answer is certain.
- If all of them are one, the name was **probably** added. Other names may have set those bits by chance.

That row of bits, plus the fixed set of hash functions, is a **Bloom filter**. The wrong "probably yes" is a
**false positive**. A wrong "no" (a false negative) cannot happen, because adding only ever turns bits on.

<div class="widget">
  <h4>Try it: 32 bits, 3 hash functions</h4>
  <div class="row">
    <input v-model="word" placeholder="a word" @keyup.enter="check" />
    <button class="primary" @click="add">Add</button>
    <button @click="check">Check</button>
    <button @click="reset">Reset</button>
  </div>
  <div class="bits">
    <span v-for="(b, i) in bits" :key="i" :class="{ on: b, probe: current.includes(i) }">{{ b }}</span>
  </div>
  <p class="result" v-if="result">
    <template v-if="result.kind === 'added'">Added “{{ result.w }}”.</template>
    <template v-else-if="result.kind === 'no'">“{{ result.w }}”: definitely not added (a bit is zero).</template>
    <template v-else-if="result.kind === 'yes'">“{{ result.w }}”: probably added, and it really was.</template>
    <template v-else>“{{ result.w }}”: probably added, but it was not. That is a <strong>false positive</strong>.</template>
  </p>
  <p class="hint">Outlined cells are the positions for the word you are typing. Add 8–10 words, then check new
  ones: false positives start to appear as the row fills up.</p>
</div>

<style scoped>
.bits { display: grid; grid-template-columns: repeat(16, 1fr); gap: 3px; margin: 16px 0 8px; }
.bits span {
  text-align: center; font-family: var(--vp-font-family-mono); font-size: 13px; padding: 4px 0;
  border-radius: 4px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-3);
}
.bits span.on { background: var(--d-a-soft); color: var(--vp-c-text-1); }
.bits span.probe { border-color: var(--d-b); box-shadow: 0 0 0 1px var(--d-b); }
.result { margin: 8px 0 0; }
.hint { margin: 4px 0 0; font-size: 14px; color: var(--vp-c-text-2); }
</style>

## How wrong it gets

**In short:** about 10 bits per item gives roughly a 1% false positive rate. Each extra 5 bits per item cuts
the rate about tenfold.

The false positive rate depends on how full the row is. More bits per item means fewer collisions. The number
of hash functions is a balance: more of them means more bits to check, but also fills the row faster.

| Bits per item | Best number of hashes | False positive rate |
|---|---|---|
| 5 | 3–4 | about 10% |
| 10 | 7 | about 1% |
| 15 | 10 | about 0.1% |

Compare that with storing the items. A set of 100 million 20-byte keys needs about 2 GB. A Bloom filter for
them at 1% needs about 120 MB, whatever the key size.

::: details Going deeper: the formula
With `m` bits, `n` items and `k` hash functions, the false positive rate is about `(1 − e^(−kn/m))^k`.
It is lowest when `k = (m/n) · ln 2`, which leaves about half the bits set. At that point, the rate is about
`0.6185^(m/n)`, which is where "10 bits per item for 1%" comes from (9.6 bits, to be exact).

You do not need `k` truly independent hash functions. Computing two hashes and combining them as
`h1 + i · h2` for `i = 0…k−1` works as well in practice (Kirsch and Mitzenmacher, 2006).
:::

## Where it is used

**In short:** in front of anything slow, to skip lookups for things that are not there.

- **Databases built on sorted files on disk** (Bigtable, Cassandra, RocksDB, and others). Each file keeps a
  Bloom filter of its keys in memory. A read checks the filter first and skips files that cannot hold the
  key, which saves most disk reads for missing keys.
- **Caches and CDNs.** A filter of "URLs requested before" can stop one-off requests from filling the cache:
  only cache an item the second time it is asked for.
- **Network and security tools.** Checking a stream of items against a large blocklist, where a "maybe" is
  followed by an exact check.

The pattern is always the same: a cheap, in-memory "definitely not" that saves an expensive step. A "maybe"
falls through to the real check, so false positives cost time, not correctness.

## Limits

**In short:** you cannot delete, you cannot list what is inside, and you must size it up front.

- **No delete.** Clearing a bit might erase it for other items too. A **counting Bloom filter** stores a
  small counter per position instead of a bit, at about 4 times the memory.
- **Fixed size.** As you add more items than planned, the false positive rate climbs. You rebuild a bigger
  filter, or chain new filters as old ones fill (a "scalable" Bloom filter).
- **No listing.** The filter cannot tell you what it contains, only answer about a given item.

If you need deletes, a **cuckoo filter** (Fan et al., 2014) stores short fingerprints of items instead of
bits, supports removal, and uses less space than a Bloom filter at low false positive rates.

## Key takeaways

- "No" is certain; "yes" means "probably". Use it to skip work, never as the final answer.
- About 10 bits per item for 1% false positives, independent of item size.
- No deletes and fixed capacity; reach for counting or cuckoo filters if you need more.

## Sources

- Burton H. Bloom, "Space/Time Trade-offs in Hash Coding with Allowable Errors", paper, 1970.
  [ACM](https://dl.acm.org/doi/10.1145/362686.362692)
- Kirsch and Mitzenmacher, "Less Hashing, Same Performance: Building a Better Bloom Filter", paper, 2006.
  [PDF](https://www.eecs.harvard.edu/~michaelm/postscripts/rsa2008.pdf)
- Fan et al., "Cuckoo Filter: Practically Better Than Bloom", paper, 2014.
  [PDF](https://www.cs.cmu.edu/~dga/papers/cuckoo-conext2014.pdf)
