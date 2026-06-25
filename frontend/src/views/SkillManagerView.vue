<template>
  <div
    class="min-h-screen bg-gradient-to-b from-surface-container-low to-surface font-body-md text-body-md"
  >
    <TopNavBar />

    <main class="max-w-4xl mx-auto px-gutter py-stack-lg mt-stack-lg">
      <!-- Skills Grid -->
      <div
        class="grid grid-cols-1 gap-4 mt-stack-lg"
        :class="{ 'md:grid-cols-2': skills.length > 0 }"
      >
        <!-- Loading Skeleton -->
        <div
          v-if="isLoading"
          v-for="i in 4"
          :key="i"
          class="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20 animate-pulse"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="h-6 bg-surface-container rounded w-1/2 mb-2"></div>
              <div class="h-5 bg-surface-container rounded w-1/3"></div>
            </div>
            <div class="flex gap-2">
              <div class="w-10 h-10 bg-surface-container rounded-lg"></div>
              <div class="w-10 h-10 bg-surface-container rounded-lg"></div>
            </div>
          </div>

          <!-- Progress Bar Skeleton -->
          <div class="mt-3">
            <div class="flex items-center justify-between mb-1">
              <div class="h-4 bg-surface-container rounded w-12"></div>
              <div class="h-4 bg-surface-container rounded w-8"></div>
            </div>
            <div class="h-2 bg-surface-container rounded-full"></div>
          </div>

          <!-- Description Skeleton -->
          <div class="mt-3 space-y-1">
            <div class="h-4 bg-surface-container rounded w-full"></div>
            <div class="h-4 bg-surface-container rounded w-3/4"></div>
          </div>
        </div>

        <!-- Skill Cards -->
        <div
          v-if="skills.length > 0"
          v-for="skill in skills"
          :key="skill.id"
          class="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20 hover:border-primary/50 transition-all hover:shadow-sm"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-headline-md text-headline-md text-on-surface">
                {{ skill.name }}
              </h3>
              <span
                class="inline-block px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-xs rounded mt-1"
              >
                {{ skill.category }}
              </span>
            </div>
            <div class="flex gap-2">
              <button
                @click="editSkill(skill)"
                class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                title="编辑"
              >
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button
                @click="deleteSkill(skill.id)"
                class="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                title="删除"
              >
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mt-3">
            <div
              class="flex items-center justify-between text-sm text-on-surface-variant mb-1"
            >
              <span>熟练�?/span>
              <span>{{ skill.level * 10 }}%</span>
            </div>
            <div
              class="h-2 bg-surface-container-high rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-primary rounded-full transition-all duration-500"
                :style="{ width: `${skill.level * 10}%` }"
              ></div>
            </div>
          </div>

          <!-- Description Preview -->
          <div
            v-if="skill.description"
            class="mt-3 text-sm text-on-surface-variant line-clamp-2"
          >
            {{ skill.description }}
          </div>
        </div>

        <div
          v-else-if="skillsError"
          class="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 text-center"
        >
          <p class="text-error mb-4">{{ skillsError }}</p>
          <button
            @click="fetchSkills"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
      <!-- Floating Add Button -->
      <button
        @click="openAddModal"
        class="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center z-50"
        title="添加技�?
      >
        <span class="material-symbols-outlined text-2xl">add</span>
      </button>

      <!-- Add/Edit Modal -->
      <Teleport to="body">
        <transition name="dialog">
          <div
            v-if="showModal"
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            @click.self="closeModal"
          >
            <div
              class="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 class="font-headline-md text-headline-md text-on-surface">
                  {{ editingSkill ? "编辑技�? : "添加技�? }}
                </h2>
                <button
                  @click="closeModal"
                  class="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg"
                >
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>

              <form @submit.prevent="saveSkill" class="space-y-4">
                <div>
                  <label
                    class="block font-label-xs text-primary font-bold uppercase tracking-wider mb-2"
                  >
                    技能名�?
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-lg font-body-md text-on-surface transition-all focus:border-primary focus:outline-none"
                    placeholder="如：Vue3"
                  />
                </div>

                <div>
                  <label
                    class="block font-label-xs text-primary font-bold uppercase tracking-wider mb-2"
                  >
                    分类
                  </label>
                  <el-select
                    v-model="formData.category"
                    placeholder="请选择分类"
                    class="w-full"
                  >
                    <el-option label="前端" value="Frontend" />
                    <el-option label="后端" value="Backend" />
                    <el-option label="数据�? value="Database" />
                    <el-option label="DevOps" value="DevOps" />
                    <el-option label="编程语言" value="Language" />
                  </el-select>
                </div>

                <!-- Icon Selection -->
                <div>
                  <label
                    class="block font-label-xs text-primary font-bold uppercase tracking-wider mb-2"
                  >
                    图标
                  </label>
                  <div class="flex flex-wrap gap-3 mb-2">
                    <!-- Default Material Symbols Icon -->
                    <button
                      type="button"
                      @click="formData.icon = ''"
                      :class="[
                        'w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all',
                        !formData.icon
                          ? 'border-primary bg-primary/10'
                          : 'border-outline-variant hover:border-primary/50',
                      ]"
                      title="默认图标"
                    >
                      <span class="material-symbols-outlined text-primary"
                        >code</span
                      >
                    </button>

                    <!-- SVG Icons from assets -->
                    <button
                      v-for="svgIcon in svgIcons"
                      :key="svgIcon.name"
                      type="button"
                      @click="formData.icon = svgIcon.file"
                      :class="[
                        'w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all p-2',
                        formData.icon === svgIcon.file
                          ? 'border-primary bg-primary/10'
                          : 'border-outline-variant hover:border-primary/50',
                      ]"
                      :title="svgIcon.name"
                    >
                      <img
                        :src="getIconUrl(svgIcon.file)"
                        :alt="svgIcon.name"
                        class="w-full h-full object-contain"
                      />
                    </button>
                  </div>
                  <p class="text-xs text-on-surface-variant">
                    点击选择图标，或留空使用默认图标
                  </p>
                </div>

                <div>
                  <label
                    class="block font-label-xs text-primary font-bold uppercase tracking-wider mb-2"
                  >
                    熟练�? {{ formData.level * 10 }}%
                  </label>
                  <input
                    v-model.number="formData.level"
                    type="range"
                    min="1"
                    max="10"
                    class="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div
                    class="flex justify-between text-xs text-on-surface-variant mt-1"
                  >
                    <span>10%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div>
                  <label
                    class="block font-label-xs text-primary font-bold uppercase tracking-wider mb-2"
                  >
                    技术要点描�?
                  </label>
                  <el-input
                    v-model="formData.description"
                    type="textarea"
                    :rows="4"
                    placeholder="描述该技术栈的核心要点和实践经验..."
                  />
                </div>

                <div class="flex gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeModal"
                    class="flex-1 py-3 border border-outline text-on-surface-variant font-body-md rounded-lg hover:bg-surface-container-high transition-all"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    :disabled="isSaving"
                    class="flex-1 py-3 bg-primary text-on-primary font-body-md rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {{ isSaving ? "保存�?.." : "保存" }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </transition>
      </Teleport>

      <!-- 删除确认对话�?-->
      <DeleteConfirm
        v-model:visible="showDeleteConfirm"
        title="确认删除"
        message="确定要删除这个技能吗�?
        sub-message="此操作无法撤销，请谨慎操作�?
        confirm-text="删除"
        :loading="isDeleting"
        @confirm="handleDeleteConfirm"
        @cancel="handleDeleteCancel"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import TopNavBar from "../components/TopNavBar.vue";
import DeleteConfirm from "../components/DeleteConfirm.vue";
import { useScrollLock } from "@vueuse/core";

const skills = ref<any[]>([]);
const showModal = ref(false);
const editingSkill = ref<any>(null);
const isSaving = ref(false);
const isLoading = ref(true);
const skillsError = ref("");

// 删除确认对话框状�?
const showDeleteConfirm = ref(false);
const isLocked = useScrollLock(document.documentElement);
watch(showDeleteConfirm, (val) => {
  isLocked.value = val;
});

watch(showModal, (val) => {
  isLocked.value = val;
});

const deletingSkillId = ref<string | null>(null);
const isDeleting = ref(false);

const formData = reactive({
  name: "",
  category: "",
  level: 5,
  description: "",
  icon: "",
});

// 可选的 SVG 图标列表（只存储文件名）
const svgIcons = [
  { name: "Vue", file: "vue.svg" },
  { name: "React", file: "react.svg" },
  { name: "TypeScript", file: "TypeScript.svg" },
  { name: "Node.js", file: "nodejs.svg" },
  { name: "PostgreSQL", file: "PostgreSQL.svg" },
  { name: "Docker", file: "Docker.svg" },
  { name: "Git", file: "GIt.svg" },
  { name: "Tailwind CSS", file: "tailwindcss.svg" },
  { name: "Mobile", file: "Mobile.svg" },
  { name: "AI", file: "AI.svg" },
  { name: "webpack", file: "webpack.svg" },
  { name: "vite", file: "vite.svg" },
  { name: "Java", file: "Java.svg" },
  { name: "Go", file: "Go.svg" },
  { name: "Jenkins", file: "Jenkins.svg" },
  { name: "Python", file: "Python.svg" },
];

// 获取图标 URL
const getIconUrl = (fileName: string) => {
  return new URL(`../assets/svg/${fileName}`, import.meta.url).href;
};

const fetchSkills = async () => {
  isLoading.value = true;
  skills.value = []; // 清空数据，避免骨架屏和旧数据同时显示

  try {
    const response = await fetch("/api/skills");
    if (response.ok) {
      skills.value = await response.json();
    } else {
      skillsError.value = "加载技能列表失�?;
    }
  } catch (error: any) {
        skillsError.value = error.message || "网络连接失败，请检查网络设�?;
  } finally {
    isLoading.value = false;
  }
};

const openAddModal = () => {
  editingSkill.value = null;
  formData.name = "";
  formData.category = "";
  formData.level = 5;
  formData.description = "";
  formData.icon = "";
  showModal.value = true;
};

const editSkill = (skill: any) => {
  editingSkill.value = skill;
  formData.name = skill.name;
  formData.category = skill.category;
  formData.level = skill.level;
  formData.description = skill.description || "";
  formData.icon = skill.icon || "";
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingSkill.value = null;
};

const saveSkill = async () => {
  isSaving.value = true;

  try {
    const url = editingSkill.value
      ? `/api/skills/${editingSkill.value.id}`
      : "/api/skills";
    const method = editingSkill.value ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      closeModal();
      await fetchSkills();
    } else {
      const error = await response.json();
      alert(error.error || "保存失败");
    }
  } catch (error) {
        alert("保存失败，请稍后重试");
  } finally {
    isSaving.value = false;
  }
};

const deleteSkill = (id: string) => {
  deletingSkillId.value = id;
  showDeleteConfirm.value = true;
};

const handleDeleteConfirm = async () => {
  if (!deletingSkillId.value) return;

  isDeleting.value = true;

  try {
    const response = await fetch(`/api/skills/${deletingSkillId.value}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      await fetchSkills();
    } else {
      const error = await response.json();
      alert(error.error || "删除失败");
    }
  } catch (error) {
        alert("删除失败，请稍后重试");
  } finally {
    isDeleting.value = false;
    showDeleteConfirm.value = false;
    deletingSkillId.value = null;
  }
};

const handleDeleteCancel = () => {
  showDeleteConfirm.value = false;
  deletingSkillId.value = null;
};

onMounted(() => {
  fetchSkills();
});
</script>
