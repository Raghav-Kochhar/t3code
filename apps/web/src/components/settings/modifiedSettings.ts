import { DEFAULT_UNIFIED_SETTINGS, type UnifiedSettings } from "@t3tools/contracts/settings";
import * as Equal from "effect/Equal";

import {
  getChangedBrowserSettingLabels,
  getChangedTypographySettingLabels,
  hasChangedBackgroundActivitySettings,
} from "./SettingsPanels.logic";
import type { SettingsSearchItemId } from "./settingsSearch";

export const MODIFIED_ONLY_STORAGE_KEY = "t3code:settings-show-modified-only";

export interface ModifiedThemeState {
  readonly theme: string;
  readonly followSystem: boolean;
  readonly hasThemeMix: boolean;
  readonly separateFonts?: boolean;
}

function isTextGenerationModelDirty(settings: UnifiedSettings): boolean {
  return !Equal.equals(
    settings.textGenerationModelSelection ?? null,
    DEFAULT_UNIFIED_SETTINGS.textGenerationModelSelection ?? null,
  );
}

function isSnoozePresetsDirty(settings: UnifiedSettings): boolean {
  return !Equal.equals(settings.snoozePresets, DEFAULT_UNIFIED_SETTINGS.snoozePresets);
}

function isThreadDetailsDirty(settings: UnifiedSettings): boolean {
  return (
    settings.threadDetailsUsageEnabled !== DEFAULT_UNIFIED_SETTINGS.threadDetailsUsageEnabled ||
    !Equal.equals(settings.threadDetailsItems, DEFAULT_UNIFIED_SETTINGS.threadDetailsItems)
  );
}

function isSnapshotDirty(
  settings: UnifiedSettings,
  key:
    | "snapShotEnabled"
    | "snapShotIncludeAccessibility"
    | "snapShotShortcut"
    | "snapShotPlaySound"
    | "snapShotSound"
    | "snapShotFlash"
    | "snapShotAnimations",
): boolean {
  if (key === "snapShotShortcut" || key === "snapShotSound") {
    return !Equal.equals(settings[key], DEFAULT_UNIFIED_SETTINGS[key]);
  }
  return settings[key] !== DEFAULT_UNIFIED_SETTINGS[key];
}

/**
 * Returns the search-item ids whose backing setting differs from its built-in
 * default. Mirrors the comparisons in `useSettingsRestore` so the Modified-only
 * list stays consistent with "Restore device defaults".
 */
export function getModifiedSearchItemIds(
  settings: UnifiedSettings,
  theme: ModifiedThemeState,
): SettingsSearchItemId[] {
  const ids = new Set<SettingsSearchItemId>();

  if (theme.theme !== "system" || !theme.followSystem) {
    ids.add("theme");
    ids.add("color-scheme");
  }
  if (theme.hasThemeMix) {
    ids.add("theme");
  }
  if (theme.separateFonts === true) {
    ids.add("separate-fonts");
  }

  if (settings.appearanceContrast !== DEFAULT_UNIFIED_SETTINGS.appearanceContrast) {
    ids.add("setting-appearance-contrast");
  }
  if (settings.glassOpacity !== DEFAULT_UNIFIED_SETTINGS.glassOpacity) {
    ids.add("setting-glass-opacity");
  }
  if (settings.diffColorScheme !== DEFAULT_UNIFIED_SETTINGS.diffColorScheme) {
    ids.add("diff-color-scheme");
  }
  if (settings.chatWidth !== DEFAULT_UNIFIED_SETTINGS.chatWidth) {
    ids.add("chat-width");
  }
  if (settings.effortDisplay !== DEFAULT_UNIFIED_SETTINGS.effortDisplay) {
    ids.add("effort-display");
  }
  if (settings.mathRenderingEnabled !== DEFAULT_UNIFIED_SETTINGS.mathRenderingEnabled) {
    ids.add("math-rendering");
  }
  if (settings.panelAnimationDurationMs !== DEFAULT_UNIFIED_SETTINGS.panelAnimationDurationMs) {
    ids.add("panel-animations");
  }
  if (
    settings.environmentIdentificationMode !==
    DEFAULT_UNIFIED_SETTINGS.environmentIdentificationMode
  ) {
    ids.add("environment-identification");
  }
  if (settings.timestampFormat !== DEFAULT_UNIFIED_SETTINGS.timestampFormat) {
    ids.add("time-format");
  }
  if (settings.notificationMode !== DEFAULT_UNIFIED_SETTINGS.notificationMode) {
    ids.add("thread-notifications");
  }
  if (settings.inAppNotificationsEnabled !== DEFAULT_UNIFIED_SETTINGS.inAppNotificationsEnabled) {
    ids.add("in-app-notifications");
  }
  if (settings.sidebarProjectGroupingMode !== DEFAULT_UNIFIED_SETTINGS.sidebarProjectGroupingMode) {
    ids.add("project-grouping");
  }
  if (settings.sidebarProjectSortOrder !== DEFAULT_UNIFIED_SETTINGS.sidebarProjectSortOrder) {
    ids.add("project-order");
  }
  if (settings.sidebarWorkingShelfEnabled !== DEFAULT_UNIFIED_SETTINGS.sidebarWorkingShelfEnabled) {
    ids.add("working-shelf");
  }
  if (settings.sidebarAutoSettleAfterDays !== DEFAULT_UNIFIED_SETTINGS.sidebarAutoSettleAfterDays) {
    ids.add("auto-settle-inactive-threads");
    ids.add("days-before-auto-settle");
  }
  if (
    settings.sidebarAutoSettleKeepPullRequests !==
    DEFAULT_UNIFIED_SETTINGS.sidebarAutoSettleKeepPullRequests
  ) {
    ids.add("keep-threads-with-pull-requests");
  }
  if (settings.sidebarAutoSettleOnMerge !== DEFAULT_UNIFIED_SETTINGS.sidebarAutoSettleOnMerge) {
    ids.add("auto-settle-merged-threads");
  }
  if (settings.autoResumeLimitedThreads !== DEFAULT_UNIFIED_SETTINGS.autoResumeLimitedThreads) {
    ids.add("auto-resume-limited-threads");
  }
  if (settings.snoozeLimitedThreads !== DEFAULT_UNIFIED_SETTINGS.snoozeLimitedThreads) {
    ids.add("snooze-limited-threads");
  }
  if (isSnoozePresetsDirty(settings)) {
    ids.add("snooze-options");
  }
  if (settings.wordWrap !== DEFAULT_UNIFIED_SETTINGS.wordWrap) {
    ids.add("word-wrap");
  }
  if (
    settings.persistComposerContextStrip !== DEFAULT_UNIFIED_SETTINGS.persistComposerContextStrip
  ) {
    ids.add("composer-context");
  }
  if (settings.fontSmoothing !== DEFAULT_UNIFIED_SETTINGS.fontSmoothing) {
    ids.add("font-smoothing");
  }

  for (const label of getChangedTypographySettingLabels(settings)) {
    if (label === "Interface font") ids.add("interface-font");
    else if (label === "Prompt font") ids.add("prompt-font");
    else if (label === "Code font") ids.add("code-font");
    else if (label === "Terminal font") ids.add("terminal-font");
  }

  if (settings.diffFilesCollapsed !== DEFAULT_UNIFIED_SETTINGS.diffFilesCollapsed) {
    ids.add("default-diff-file-state");
  }
  if (settings.diffIgnoreWhitespace !== DEFAULT_UNIFIED_SETTINGS.diffIgnoreWhitespace) {
    ids.add("hide-whitespace-changes");
  }
  if (settings.diffLayout !== DEFAULT_UNIFIED_SETTINGS.diffLayout) {
    ids.add("diff-layout");
  }
  if (settings.proactivePanelsEnabled !== DEFAULT_UNIFIED_SETTINGS.proactivePanelsEnabled) {
    ids.add("proactive-panels");
  }
  if (settings.showSkillsInSlashMenu !== DEFAULT_UNIFIED_SETTINGS.showSkillsInSlashMenu) {
    ids.add("skills-in-slash-menu");
  }
  if (settings.composerRichTextEnabled !== DEFAULT_UNIFIED_SETTINGS.composerRichTextEnabled) {
    ids.add("composer-rich-text");
  }
  if (settings.sendShortcut !== DEFAULT_UNIFIED_SETTINGS.sendShortcut) {
    ids.add("send-shortcut");
  }
  if (settings.followUpBehavior !== DEFAULT_UNIFIED_SETTINGS.followUpBehavior) {
    ids.add("follow-up-behavior");
  }
  if (settings.contextWindowMeterEnabled !== DEFAULT_UNIFIED_SETTINGS.contextWindowMeterEnabled) {
    ids.add("legacy-context-window-indicator");
  }
  if (settings.responseStreamingMode !== DEFAULT_UNIFIED_SETTINGS.responseStreamingMode) {
    ids.add("response-streaming");
  }
  if (settings.enableProviderUpdateChecks !== DEFAULT_UNIFIED_SETTINGS.enableProviderUpdateChecks) {
    ids.add("provider-update-checks");
  }
  if (
    settings.continueThreadsAfterServerUpdate !==
    DEFAULT_UNIFIED_SETTINGS.continueThreadsAfterServerUpdate
  ) {
    ids.add("continue-threads-after-server-update");
  }
  if (hasChangedBackgroundActivitySettings(settings)) {
    ids.add("background-activity");
    ids.add("git-fetch-interval");
  }
  if (settings.defaultThreadEnvMode !== DEFAULT_UNIFIED_SETTINGS.defaultThreadEnvMode) {
    ids.add("new-threads");
  }
  if (
    settings.newWorktreesStartFromOrigin !== DEFAULT_UNIFIED_SETTINGS.newWorktreesStartFromOrigin
  ) {
    ids.add("start-from-origin");
  }
  if (settings.addProjectBaseDirectory !== DEFAULT_UNIFIED_SETTINGS.addProjectBaseDirectory) {
    ids.add("add-project-starts-in");
  }
  if (settings.confirmThreadUnpin !== DEFAULT_UNIFIED_SETTINGS.confirmThreadUnpin) {
    ids.add("unpin-confirmation");
  }
  if (settings.confirmThreadArchive !== DEFAULT_UNIFIED_SETTINGS.confirmThreadArchive) {
    ids.add("archive-confirmation");
  }
  if (settings.confirmThreadDelete !== DEFAULT_UNIFIED_SETTINGS.confirmThreadDelete) {
    ids.add("delete-confirmation");
  }
  if (settings.confirmQuit !== DEFAULT_UNIFIED_SETTINGS.confirmQuit) {
    ids.add("quit-confirmation");
  }
  if (isTextGenerationModelDirty(settings)) {
    ids.add("text-generation-model");
  }
  if (settings.threadTitleInstructions !== DEFAULT_UNIFIED_SETTINGS.threadTitleInstructions) {
    ids.add("thread-title-instructions");
  }
  if (isThreadDetailsDirty(settings)) {
    ids.add("thread-details-items");
  }

  for (const label of getChangedBrowserSettingLabels(settings)) {
    if (label === "Browser viewport") ids.add("browser-default-viewport");
    else if (label === "Browser zoom") ids.add("browser-default-zoom");
    else if (label === "Browser appearance") ids.add("browser-default-appearance");
    else if (label === "Recording frame rate") ids.add("browser-recording-frame-rate");
    else if (label === "Recording key presses") ids.add("browser-recording-key-presses");
    else if (label === "Recording mouse presses") ids.add("browser-recording-mouse-presses");
    else if (label === "Open links in") ids.add("browser-link-target");
    else if (label === "Search engine") ids.add("browser-search-engine");
    else if (label === "Floating preview") ids.add("browser-auto-show-floating-preview");
    else if (label === "Open pull requests in T3 Code") {
      ids.add("pull-request-links-open-in-app");
    }
  }

  if (settings.enableAgentBrowserAccess !== DEFAULT_UNIFIED_SETTINGS.enableAgentBrowserAccess) {
    ids.add("agent-browser-access");
  }

  if (isSnapshotDirty(settings, "snapShotEnabled")) ids.add("snap-shot-enabled");
  if (isSnapshotDirty(settings, "snapShotIncludeAccessibility")) {
    ids.add("snap-shot-accessibility");
  }
  if (isSnapshotDirty(settings, "snapShotShortcut")) ids.add("snap-shot-shortcut");
  if (
    isSnapshotDirty(settings, "snapShotPlaySound") ||
    isSnapshotDirty(settings, "snapShotSound")
  ) {
    ids.add("snap-shot-sound");
  }
  if (isSnapshotDirty(settings, "snapShotFlash")) ids.add("snap-shot-flash");
  if (isSnapshotDirty(settings, "snapShotAnimations")) ids.add("snap-shot-animations");

  return [...ids];
}

export function isModifiedSearchItem(
  item: { readonly id: string; readonly targetId?: string },
  modifiedIds: ReadonlySet<string>,
): boolean {
  return (
    modifiedIds.has(item.id) || (item.targetId !== undefined && modifiedIds.has(item.targetId))
  );
}
