/*
 * View model for OctoPrint-CustomKeyboardControls
 *
 * Copyright (C) 2022 Jefferey Neuffer (https://github.com/j7126)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
$(function () {
    function CustomKeyboardControlViewModel(parameters) {
        var self = this;

        self.controlViewModel = parameters[0];
        self.settingsViewModel = parameters[1];

        self.active = ko.observable(false);

        self.accentColor = ko.observable("#08c");
        self.textOnAccent = ko.observable("#fff");

        self.editingName = ko.observable("");
        self.editingID = ko.observable("");
        self.editingKeys = ko.computed(() => {
            try {
                return self.settingsViewModel.settings.plugins.customkeyboardcontrol[self.editingID()].split(',');
            }
            catch {
                return [];
            }
        });

        self.toggleActive = function () {
            self.active(self.controlViewModel.keycontrolPossible() && !self.active());
        }

        // get color to use depending on ui customiser or themify themes
        self.RefreshThemeColors = function () {
            try {
                var theme;
                theme = self.settingsViewModel.settings.plugins.themeify.theme();
                if (self.settingsViewModel.settings.plugins.themeify.enabled() == false) {
                    theme = '';
                }
                switch (theme) {
                    case 'discorded':
                        self.accentColor('#7289da');
                        break;
                    case 'material_ui_light':
                        self.accentColor('#2196f3');
                        break;
                    case 'cyborg':
                        self.accentColor('#33b5e5');
                        break;
                    case 'discoranged':
                        self.accentColor('#fc8003');
                        break;
                    case 'dyl':
                        self.accentColor('#ff9800');
                        break;
                    case 'nighttime':
                        self.accentColor('#0073ff');
                        break;
                    default:
                        self.accentColor('#08c');
                        break;
                }
            } catch { }

            if ($(":root").css("--accent")) {
                self.accentColor($(":root").css("--accent"));
            }

            if ($(".btn-primary").css("color")) {
                self.textOnAccent($(".btn-primary").css("color"));
            }
        }

        // startup complete
        self.onStartupComplete = function () {
            self.RefreshThemeColors();

            try {
                self.settingsViewModel.settings.plugins.themeify.theme.subscribe(function (newValue) {
                    self.RefreshThemeColors();
                });
                self.settingsViewModel.settings.plugins.themeify.enabled.subscribe(function (newValue) {
                    self.RefreshThemeColors();
                });
            } catch { }

            document.body.addEventListener("keydown", event => {
                if (!self.controlViewModel.keycontrolPossible()) return true;
                if (!self.active()) return true;

                var button = undefined;
                var visualizeClick = true;

                switch (event.key) {
                    case 'ArrowLeft': // left arrow key
                        // X-
                        button = $("#control-xdec");
                        break;
                    case 'ArrowUp': // up arrow key
                        // Y+
                        button = $("#control-yinc");
                        break;
                    case 'ArrowRight': // right arrow key
                        // X+
                        button = $("#control-xinc");
                        break;
                    case 'ArrowDown': // down arrow key
                        // Y-
                        button = $("#control-ydec");
                        break;
                    case '1': // number 1
                        // Distance 0.1
                        button = $("#control-distance01");
                        visualizeClick = false;
                        break;
                    case '2': // number 2
                        // Distance 1
                        button = $("#control-distance1");
                        visualizeClick = false;
                        break;
                    case '3': // number 3
                        // Distance 10
                        button = $("#control-distance10");
                        visualizeClick = false;
                        break;
                    case '4': // number 4
                        // Distance 100
                        button = $("#control-distance100");
                        visualizeClick = false;
                        break;
                    case 'PageUp': // page up key
                    case 'w': // w key
                        // z lift up
                        button = $("#control-zinc");
                        break;
                    case 'PageDown': // page down key
                    case 's': // s key
                        // z lift down
                        button = $("#control-zdec");
                        break;
                    case 'Home': // home key
                        // xy home
                        button = $("#control-xyhome");
                        break;
                    case 'End': // end key
                        // z home
                        button = $("#control-zhome");
                        break;
                    case 'Escape':
                        event.preventDefault();
                        self.active(false);
                        return false;
                    default:
                        return true;
                }

                if (button === undefined) {
                    return false;
                } else {
                    event.preventDefault();
                    if (visualizeClick) {
                        button.addClass("active");
                        setTimeout(function () {
                            button.removeClass("active");
                        }, 150);
                    }
                    button.click();
                }
            });
        }

        self.onSettingsBeforeSave = function () {
            self.RefreshThemeColors();
            setTimeout(() => {
                self.RefreshThemeColors();
            }, 5000);
        };
    };

    // view model class, parameters for constructor, container to bind to
    OCTOPRINT_VIEWMODELS.push({
        construct: CustomKeyboardControlViewModel,
        dependencies: ["controlViewModel", "settingsViewModel"],
        elements: ["#navbar_plugin_customkeyboardcontrol", "#settings_plugin_customkeyboardcontrol"]
    });

});
