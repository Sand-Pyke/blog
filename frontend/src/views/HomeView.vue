<template>
  <div
    class="font-body-md text-body-md antialiased overflow-x-hidden bg-gradient-to-b from-surface-container-low to-surface min-h-screen"
  >
    <TopNavBar />

    <main
      class="mt-24 max-w-container-max mx-auto px-gutter md:px-0 pb-stack-xl"
    >
      <!-- Hero Section -->
      <section class="mb-stack-lg">
        <div
          class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 md:p-8"
        >
          <HeroSection :user="currentUser" />
        </div>
      </section>

      <!-- Core Skills -->
      <section class="mb-stack-lg">
        <div
          class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 md:p-8"
        >
          <h2
            class="font-headline-md text-headline-md text-on-surface mb-stack-lg flex items-center gap-2"
          >
            核心技术栈 <span class="w-12 h-[1px] bg-outline-variant"></span>
          </h2>
          <div
            v-if="skillsLoading"
            class="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div
              v-for="i in 4"
              :key="i"
              class="bg-surface-container rounded-xl p-4 animate-pulse"
            >
              <div
                class="h-6 bg-surface-container-high rounded w-1/2 mb-2"
              ></div>
              <div class="h-4 bg-surface-container-high rounded w-3/4"></div>
            </div>
          </div>
          <div
            v-else-if="skillsError"
            class="text-error text-sm py-8 text-center"
          >
            <p>{{ skillsError }}</p>
            <button
              @click="fetchSkills"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              重试
            </button>
          </div>
          <div v-else class="space-y-6">
            <!-- Frontend -->
            <div v-if="frontendSkills.length > 0">
              <h3
                class="font-label-xs text-primary font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-sm">web</span>
                前端
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="skill in frontendSkills"
                  :key="skill.id"
                  @click="showSkillDetail(skill)"
                  class="cursor-pointer"
                >
                  <SkillCard :skill="skill" />
                </div>
              </div>
            </div>

            <!-- Backend -->
            <div v-if="backendSkills.length > 0">
              <h3
                class="font-label-xs text-primary font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-sm">dns</span>
                后端
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="skill in backendSkills"
                  :key="skill.id"
                  @click="showSkillDetail(skill)"
                  class="cursor-pointer"
                >
                  <SkillCard :skill="skill" />
                </div>
              </div>
            </div>

            <!-- Database -->
            <div v-if="databaseSkills.length > 0">
              <h3
                class="font-label-xs text-primary font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-sm">storage</span>
                数据库
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="skill in databaseSkills"
                  :key="skill.id"
                  @click="showSkillDetail(skill)"
                  class="cursor-pointer"
                >
                  <SkillCard :skill="skill" />
                </div>
              </div>
            </div>

            <!-- DevOps -->
            <div v-if="devopsSkills.length > 0">
              <h3
                class="font-label-xs text-primary font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-sm">cloud</span>
                DevOps
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="skill in devopsSkills"
                  :key="skill.id"
                  @click="showSkillDetail(skill)"
                  class="cursor-pointer"
                >
                  <SkillCard :skill="skill" />
                </div>
              </div>
            </div>

            <!-- Language -->
            <div v-if="languageSkills.length > 0">
              <h3
                class="font-label-xs text-primary font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-sm">code</span>
                编程语言
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="skill in languageSkills"
                  :key="skill.id"
                  @click="showSkillDetail(skill)"
                  class="cursor-pointer"
                >
                  <SkillCard :skill="skill" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Posts -->
      <section>
        <div
          class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 md:p-8"
        >
          <div class="flex justify-between items-end mb-stack-lg">
            <h2 class="font-headline-md text-headline-md text-on-surface">
              近期发布
            </h2>
            <router-link
              to="/blog"
              class="text-primary font-label-xs uppercase hover:underline decoration-2 underline-offset-4"
            >
              全部文章
            </router-link>
          </div>

          <div v-if="postsLoading" class="space-y-stack-lg">
            <div
              v-for="i in 3"
              :key="i"
              class="bg-surface-container rounded-xl p-6 animate-pulse"
            >
              <div
                class="h-6 bg-surface-container-high rounded w-2/3 mb-3"
              ></div>
              <div
                class="h-4 bg-surface-container-high rounded w-full mb-2"
              ></div>
              <div class="h-4 bg-surface-container-high rounded w-4/5"></div>
            </div>
          </div>
          <div
            v-else-if="postsError"
            class="text-error text-sm py-8 text-center"
          >
            <p>{{ postsError }}</p>
            <button
              @click="fetchSkills"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              重试
            </button>
          </div>

          <div
            v-else-if="recentPosts.length === 0"
            class="text-on-surface-variant text-center py-8"
          >
            暂无文章
          </div>
          <div v-else class="space-y-stack-lg">
            <BlogPostCard
              v-for="post in recentPosts"
              :key="post.id"
              :post="post"
            />
          </div>
        </div>
      </section>
    </main>

    <!-- Skill Detail Dialog -->
    <Teleport to="body">
      <transition name="dialog">
        <div
          v-if="showSkillDialog"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          @click.self="closeSkillDialog"
        >
          <div
            class="bg-surface-container-lowest rounded-2xl p-6"
            :class="
              currentWidth === 'mobile' ? 'w-[80%]' : 'w-full max-w-[600px]'
            "
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-headline-md text-headline-md text-on-surface">
                {{ selectedSkill?.name }}
              </h2>
              <button
                @click="closeSkillDialog"
                class="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div v-if="selectedSkill" class="space-y-4">
              <div class="flex items-center gap-3 mb-4">
                <span
                  class="px-3 py-1 bg-surface-container-high text-on-surface-variant text-sm rounded-full"
                >
                  {{ selectedSkill.category }}
                </span>
                <span class="text-on-surface-variant text-sm">
                  熟练度 {{ selectedSkill.level * 10 }}%
                </span>
              </div>

              <div class="mb-6">
                <div
                  class="h-2 bg-surface-container-high rounded-full overflow-hidden"
                >
                  <div
                    class="h-full bg-primary rounded-full transition-all"
                    :style="{ width: `${selectedSkill.level * 10}%` }"
                  ></div>
                </div>
              </div>

              <!-- Description -->
              <div
                v-if="selectedSkill.description"
                class="text-on-surface-variant leading-loose whitespace-pre-line"
              >
                {{ selectedSkill.description }}
              </div>
              <div v-else class="text-on-surface-variant italic">
                暂无详细描述
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import TopNavBar from "../components/TopNavBar.vue";
import Footer from "../components/Footer.vue";
import HeroSection from "../components/HeroSection.vue";
import SkillCard from "../components/SkillCard.vue";
import BlogPostCard from "../components/BlogPostCard.vue";
import { api } from "../services/api";
import type { User, Skill, BlogPost } from "../types";
import avatarImage from "../assets/images/wxhAvatar.jpg";
import { useScrollLock } from "@vueuse/core";

const currentUser: User = {
  id: "1",
  name: "前端开发工程师",
  username: "developer",
  email: "developer@example.com",
  avatar: avatarImage,
  bio: "热爱技术，专注前端开发",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
};

const skills = ref<Skill[]>([]);
const recentPosts = ref<BlogPost[]>([]);
const skillsLoading = ref(true);
const postsLoading = ref(true);
const skillsError = ref("");
const postsError = ref("");
const showSkillDialog = ref(false);
const selectedSkill = ref<Skill | null>(null);

// 按分类分组技能
const frontendSkills = computed(() =>
  skills.value.filter((s) => s.category === "Frontend"),
);
const backendSkills = computed(() =>
  skills.value.filter((s) => s.category === "Backend"),
);
const databaseSkills = computed(() =>
  skills.value.filter((s) => s.category === "Database"),
);
const devopsSkills = computed(() =>
  skills.value.filter((s) => s.category === "DevOps"),
);
const languageSkills = computed(() =>
  skills.value.filter((s) => s.category === "Language"),
);

const showSkillDetail = (skill: Skill) => {
  selectedSkill.value = skill;
  showSkillDialog.value = true;
};

const closeSkillDialog = () => {
  showSkillDialog.value = false;
  selectedSkill.value = null;
};

const isLocked = useScrollLock(document.documentElement);

watch(showSkillDialog, (newValue) => {
  isLocked.value = newValue;
});

const fetchSkills = async () => {
  try {
    skillsLoading.value = true;
    const response = await api.getSkills();
    // 后端返回的是数组，不�?{ skills: [] } 对象
    const skillsData = Array.isArray(response)
      ? response
      : response.skills || [];
    skills.value = skillsData.map((skill: any) => ({
      id: skill.id?.toString() || "",
      name: skill.name || "",
      description: skill.description || "",
      icon: skill.icon || "code",
      level: skill.level || 0,
      category: skill.category || "Frontend",
    }));
  } catch (error: any) {
    skillsError.value = error.message;
  } finally {
    skillsLoading.value = false;
  }
};

const fetchRecentPosts = async () => {
  try {
    postsLoading.value = true;
    const response = await api.getBlogs({
      page: 1,
      limit: 3,
      status: "published",
    });
    // 后端返回的是数组，不�?{ blogs: [] } 对象
    const blogs = Array.isArray(response) ? response : response.blogs || [];
    recentPosts.value = blogs.map((blog: any) => ({
      id: blog.id?.toString() || "",
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || blog.content?.substring(0, 150) + "..." || "",
      content: blog.content || "",
      author: currentUser,
      category: blog.category
        ? {
            id: blog.category.toString(),
            name: blog.category,
            slug: blog.category,
            color: "#42b883",
          }
        : null,
      tags: blog.tags || [],
      publishedAt: blog.created_at || blog.publishedAt,
      readingTime: Math.ceil((blog.content?.length || 0) / 500),
      views: blog.views || 0,
      status: blog.status,
      createdAt: blog.created_at,
      updatedAt: blog.updated_at,
    }));
  } catch (error: any) {
    postsError.value = error.message;
  } finally {
    postsLoading.value = false;
  }
};

const currentWidth = computed(() => {
  return window.innerWidth < 768 ? "mobile" : "web";
});

onMounted(() => {
  fetchSkills();
  fetchRecentPosts();
});
</script>
