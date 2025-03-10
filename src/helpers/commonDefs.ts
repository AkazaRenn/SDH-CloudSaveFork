import Plugin from "../json/plugin.json";

export const PLUGIN_NAME: string = Plugin.name;
export const PLUGIN_NAME_NO_SPACE: string = Plugin.name.replaceAll(' ', '');
export const PLUGIN_NAME_AS_PATH: string = Plugin.name.replaceAll(' ', '-').toLowerCase();

export const GLOBAL_SYNC_APP_ID: number = 0;
export const SHARED_FILTER_APP_ID: number = -1;

export const CONTEXT_MENU_GAME_FILTER_KEY: string = `${PLUGIN_NAME_AS_PATH}-filters`;

export const CSS_MAX_VIEWABLE_HEIGHT: string = "calc(100vh - 80px)";