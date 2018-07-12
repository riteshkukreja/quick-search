const SettingService        = require("../services/apps/SettingService");

class EnterPressedHook {
    constructor() {
    }

    execute(_cmd, callback) {
        /** Search for marked searches */
        console.log("[SEARCH_HOOK]", _cmd);
        try {
            if(SettingService.selectedService) {
                SettingService.selectedService.execute(_cmd, callback);
            }
        } catch(e) {
            console.error("[SEARCH_HOOK]", e);
            callback(this.showError(e), null);
        }
    }
}

module.exports = new EnterPressedHook();