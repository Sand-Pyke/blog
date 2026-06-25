<template>
  <div class="min-h-screen bg-surface-container-low">
    <div class="px-gutter py-stack-xl max-w-container-max mx-auto">
      <h1 class="text-center mb-stack-xl">艺术字体展示</h1>
      
      <!-- 字体列表 -->
      <div class="space-y-stack-lg">
        <!-- Playfair Display -->
        <section class="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
          <h2 class="font-body-md text-primary mb-4">Playfair Display - 优雅衬线体</h2>
          <div class="space-y-2">
            <p class="font-playfair text-4xl text-on-surface">The Quick Brown Fox</p>
            <p class="font-playfair text-3xl italic text-on-surface-variant">敏捷的棕色狐狸跳过懒狗</p>
            <p class="font-playfair text-xl">适合：标题、优雅的段落文字</p>
            <code class="font-code-sm text-outline bg-surface-container-high px-2 py-1 rounded">font-playfair</code>
          </div>
        </section>

        <!-- Pacifico -->
        <section class="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
          <h2 class="font-body-md text-primary mb-4">Pacifico - 手写风格</h2>
          <div class="space-y-2">
            <p class="font-pacifico text-4xl text-on-surface">The Quick Brown Fox</p>
            <p class="font-pacifico text-3xl text-on-surface-variant">敏捷的棕色狐狸跳过懒狗</p>
            <p class="font-pacifico text-xl">适合：签名、Logo、装饰性标题</p>
            <code class="font-code-sm text-outline bg-surface-container-high px-2 py-1 rounded">font-pacifico</code>
          </div>
        </section>

        <!-- Great Vibes -->
        <section class="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
          <h2 class="font-body-md text-primary mb-4">Great Vibes - 优雅花体</h2>
          <div class="space-y-2">
            <p class="font-vibes text-4xl text-on-surface">The Quick Brown Fox</p>
            <p class="font-vibes text-3xl text-on-surface-variant">敏捷的棕色狐狸跳过懒狗</p>
            <p class="font-vibes text-xl">适合：婚礼、优雅的装饰文字</p>
            <code class="font-code-sm text-outline bg-surface-container-high px-2 py-1 rounded">font-vibes</code>
          </div>
        </section>

        <!-- Dancing Script -->
        <section class="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
          <h2 class="font-body-md text-primary mb-4">Dancing Script - 舞蹈手写体</h2>
          <div class="space-y-2">
            <p class="font-dancing text-4xl text-on-surface">The Quick Brown Fox</p>
            <p class="font-dancing text-3xl text-on-surface-variant">敏捷的棕色狐狸跳过懒狗</p>
            <p class="font-dancing text-xl">适合：活泼的标题、手写风格内容</p>
            <code class="font-code-sm text-outline bg-surface-container-high px-2 py-1 rounded">font-dancing</code>
          </div>
        </section>

        <!-- Lobster -->
        <section class="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
          <h2 class="font-body-md text-primary mb-4">Lobster - 圆润手写体</h2>
          <div class="space-y-2">
            <p class="font-lobster text-4xl text-on-surface">The Quick Brown Fox</p>
            <p class="font-lobster text-3xl text-on-surface-variant">敏捷的棕色狐狸跳过懒狗</p>
            <p class="font-lobster text-xl">适合：现代风格标题、Logo</p>
            <code class="font-code-sm text-outline bg-surface-container-high px-2 py-1 rounded">font-lobster</code>
          </div>
        </section>

        <!-- Righteous -->
        <section class="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
          <h2 class="font-body-md text-primary mb-4">Righteous - 复古粗体</h2>
          <div class="space-y-2">
            <p class="font-righteous text-4xl text-on-surface">The Quick Brown Fox</p>
            <p class="font-righteous text-3xl text-on-surface-variant">敏捷的棕色狐狸跳过懒狗</p>
            <p class="font-righteous text-xl">适合：复古风格、海报标题</p>
            <code class="font-code-sm text-outline bg-surface-container-high px-2 py-1 rounded">font-righteous</code>
          </div>
        </section>

        <!-- Caveat -->
        <section class="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
          <h2 class="font-body-md text-primary mb-4">Caveat - 笔记手写体</h2>
          <div class="space-y-2">
            <p class="font-caveat text-4xl text-on-surface">The Quick Brown Fox</p>
            <p class="font-caveat text-3xl text-on-surface-variant">敏捷的棕色狐狸跳过懒狗</p>
            <p class="font-caveat text-xl">适合：笔记风格、日记、随意的手写效果</p>
            <code class="font-code-sm text-outline bg-surface-container-high px-2 py-1 rounded">font-caveat</code>
          </div>
        </section>
      </div>

      <!-- 使用说明 -->
      <section class="mt-stack-xl bg-surface-container-high rounded-xl p-stack-lg">
        <h2 class="font-headline-md text-on-surface mb-4">使用方法</h2>
        <div class="space-y-stack-md text-on-surface-variant">
          <div>
            <h3 class="font-semibold text-on-surface mb-2">1. 在模板中使用</h3>
            <pre class="bg-inverse-surface text-inverse-on-surface p-4 rounded-lg text-sm overflow-x-auto"><code>&lt;p class="font-pacifico text-2xl"&gt;这是艺术字体&lt;/p&gt;</code></pre>
          </div>
          <div>
            <h3 class="font-semibold text-on-surface mb-2">2. 在组合式函数中使用</h3>
            <pre class="bg-inverse-surface text-inverse-on-surface p-4 rounded-lg text-sm overflow-x-auto"><code>:style="{ fontFamily: 'Pacifico, cursive' }"</code></pre>
          </div>
          <div>
            <h3 class="font-semibold text-on-surface mb-2">3. 在 CSS 中定义类</h3>
            <pre class="bg-inverse-surface text-inverse-on-surface p-4 rounded-lg text-sm overflow-x-auto"><code>.custom-title {
  font-family: 'Great Vibes', cursive;
  font-size: 2rem;
}</code></pre>
          </div>
        </div>
      </section>

      <!-- 可用字体列表 -->
      <section class="mt-stack-xl bg-surface-container-high rounded-xl p-stack-lg">
        <h2 class="font-headline-md text-on-surface mb-4">字体速查表</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="font in fontList" :key="font.class" class="bg-surface-container-lowest p-4 rounded-lg">
            <p :class="[font.class, 'text-lg text-on-surface mb-2']">{{ font.name }}</p>
            <code class="font-code-sm text-outline">{{ font.class }}</code>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const fontList = [
  { name: 'Playfair Display', class: 'font-playfair' },
  { name: 'Pacifico', class: 'font-pacifico' },
  { name: 'Great Vibes', class: 'font-vibes' },
  { name: 'Dancing Script', class: 'font-dancing' },
  { name: 'Lobster', class: 'font-lobster' },
  { name: 'Righteous', class: 'font-righteous' },
  { name: 'Caveat', class: 'font-caveat' }
];
</script>
