# coding=utf-8

#  OctoPrint-CustomKeyboardControls
#
#  Copyright (C) 2022 Jefferey Neuffer (https://github.com/j7126)
#
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU Affero General Public License as
#  published by the Free Software Foundation, either version 3 of the
#  License, or (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU Affero General Public License for more details.
#
#  You should have received a copy of the GNU Affero General Public License
#  along with this program.  If not, see <https://www.gnu.org/licenses/>.

from __future__ import absolute_import
import octoprint.plugin


class CustomKeyboardControlPlugin(octoprint.plugin.SettingsPlugin, octoprint.plugin.AssetPlugin, octoprint.plugin.TemplatePlugin,):

    # ~~ SettingsPlugin mixin
    def get_settings_defaults(self):
        return dict(
            xinc='ArrowRight',
            xdec='ArrowLeft',
            yinc='ArrowUp',
            ydec='ArrowDown',
            zinc='w,PageUp',
            zdec='s,PageDown',
            xyhome='Home',
            zhome='End',
            d1='1',
            d2='2',
            d3='3',
            d4='4'
        )

    # ~~ AssetPlugin mixin
    def get_assets(self):
        return dict(
            js=["js/customkeyboardcontrol.js"],
            css=["css/customkeyboardcontrol.css"]
        )

    # ~~ TemplatePlugin mixin
    def get_template_configs(self):
        return [
            dict(type="navbar", custom_bindings=True),
            dict(type="settings", custom_bindings=True)
        ]

    # ~~ Softwareupdate hook
    def get_update_information(self):
        return dict(
            customkeyboardcontrol=dict(
                displayName="Custom Keyboard Controls Plugin",
                displayVersion=self._plugin_version,

                # version check: github repository
                type="github_release",
                user="j7126",
                repo="OctoPrint-CustomKeyboardControls",
                current=self._plugin_version,

                stable_branch=dict(
                            name="Stable",
                            branch="master",
                            comittish=["master"],
                ),

                # update method: pip
                pip="https://github.com/j7126/OctoPrint-CustomKeyboardControls/archive/{target_version}.zip"
            )
        )


__plugin_name__ = "Custom Keyboard Controls"
__plugin_pythoncompat__ = ">=3.7,<4"


def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = CustomKeyboardControlPlugin()

    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
    }
