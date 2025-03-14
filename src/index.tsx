import { FaSave } from "react-icons/fa";
import { definePlugin } from "@decky/api";
import { PLUGIN_NAME } from "./helpers/commonDefs";
import * as ApiClient from "./helpers/apiClient";
import * as Clipboard from "./helpers/clipboard";
import PluginLogsPage from "./pages/pluginLogsPage";
import ConfigCloudPage from "./pages/configCloudPage";
import SyncTargetConfigPage from "./pages/syncTargetConfigPage";
import ContextMenuPatch from "./helpers/contextMenuPatch";
import QuickAccessMenu from "./pages/quickAccessMenu";

export default definePlugin(() => {
  const registrations: Array<Unregisterable> = [];

  registrations.push(ApiClient.setupAppLifetimeNotifications());
  registrations.push(ApiClient.setupScreenshotNotification());

  registrations.push(PluginLogsPage.register());
  registrations.push(ConfigCloudPage.register());
  registrations.push(SyncTargetConfigPage.register());

  registrations.push(ContextMenuPatch.register());

  return {
    name: PLUGIN_NAME,
    content: <QuickAccessMenu />,
    icon: <FaSave />,
    onDismount() {
      registrations.forEach(registration => registration.unregister());
      Clipboard.clear();
    }
  }
});
