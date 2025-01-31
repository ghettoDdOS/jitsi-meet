/* eslint-disable lines-around-comment */
import DropdownMenu, {
    DropdownItem,
    DropdownItemGroup
} from '@atlaskit/dropdown-menu';
import React from 'react';
import { WithTranslation } from 'react-i18next';

// @ts-ignore
import keyboardShortcut from '../../../../../modules/keyboardshortcut/keyboardshortcut';
// @ts-ignore
import { AbstractDialogTab } from '../../../base/dialog';
// @ts-ignore
import type { Props as AbstractDialogTabProps } from '../../../base/dialog';
import { translate } from '../../../base/i18n/functions';
import Checkbox from '../../../base/ui/components/web/Checkbox';
// @ts-ignore
import TouchmoveHack from '../../../chat/components/web/TouchmoveHack';
import { MAX_ACTIVE_PARTICIPANTS } from '../../../filmstrip/constants';
// @ts-ignore
import { SS_DEFAULT_FRAME_RATE } from '../../constants';

/**
 * The type of the React {@code Component} props of {@link MoreTab}.
 */
export type Props = AbstractDialogTabProps & WithTranslation & {

    /**
     * The currently selected desktop share frame rate in the frame rate select dropdown.
     */
    currentFramerate: string,

    /**
     * The currently selected language to display in the language select
     * dropdown.
     */
    currentLanguage: string,

    /**
     * All available desktop capture frame rates.
     */
    desktopShareFramerates: Array<number>,

    /**
     * Whether to show hide self view setting.
     */
    disableHideSelfView: boolean,

    /**
     * The types of enabled notifications that can be configured and their specific visibility.
     */
    enabledNotifications: Object,

    /**
     * Whether or not follow me is currently active (enabled by some other participant).
     */
    followMeActive: boolean,

    /**
     * Whether or not to hide self-view screen.
     */
    hideSelfView: boolean,

    /**
     * All available languages to display in the language select dropdown.
     */
    languages: Array<string>,

    /**
     * Whether or not to display the language select dropdown.
     */
    showLanguageSettings: boolean,

    /**
     * Whether or not to display moderator-only settings.
     */
    showModeratorSettings: boolean,

    /**
     * Whether or not to display notifications settings.
     */
    showNotificationsSettings: boolean,

    /**
     * Whether or not to show prejoin screen.
     */
    showPrejoinPage: boolean,

    /**
     * Whether or not to display the prejoin settings section.
     */
    showPrejoinSettings: boolean,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};

/**
 * The type of the React {@code Component} state of {@link MoreTab}.
 */
type State = {

    /**
     * Whether or not the desktop share frame rate select dropdown is open.
     */
    isFramerateSelectOpen: boolean,

    /**
     * Whether or not the language select dropdown is open.
     */
    isLanguageSelectOpen: boolean
};

/**
 * React {@code Component} for modifying language and moderator settings.
 *
 * @augments Component
 */
class MoreTab extends AbstractDialogTab<Props, State> {
    /**
     * Initializes a new {@code MoreTab} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        // @ts-ignore
        this.state = {
            isFramerateSelectOpen: false,
            isLanguageSelectOpen: false,
            isMaxStageParticipantsOpen: false
        };

        // Bind event handler so it is only bound once for every instance.
        this._onFramerateDropdownOpenChange = this._onFramerateDropdownOpenChange.bind(this);
        this._onFramerateItemSelect = this._onFramerateItemSelect.bind(this);
        this._onLanguageDropdownOpenChange = this._onLanguageDropdownOpenChange.bind(this);
        this._onLanguageItemSelect = this._onLanguageItemSelect.bind(this);
        this._onEnabledNotificationsChanged = this._onEnabledNotificationsChanged.bind(this);
        this._onShowPrejoinPageChanged = this._onShowPrejoinPageChanged.bind(this);
        this._onKeyboardShortcutEnableChanged = this._onKeyboardShortcutEnableChanged.bind(this);
        this._onHideSelfViewChanged = this._onHideSelfViewChanged.bind(this);
        this._renderMaxStageParticipantsSelect = this._renderMaxStageParticipantsSelect.bind(this);
        this._onMaxStageParticipantsSelect = this._onMaxStageParticipantsSelect.bind(this);
        this._onMaxStageParticipantsOpenChange = this._onMaxStageParticipantsOpenChange.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const content = [];

        content.push(this._renderSettingsLeft());
        content.push(this._renderSettingsRight());

        return (
            <div
                className = 'more-tab box'
                key = 'more'>
                { content }
            </div>
        );
    }

    /**
     * Callback invoked to toggle display of the desktop share framerate select dropdown.
     *
     * @param {Object} event - The event for opening or closing the dropdown.
     * @private
     * @returns {void}
     */
    _onFramerateDropdownOpenChange({ isOpen }: { isOpen: boolean }) {
        // @ts-ignore
        this.setState({ isFramerateSelectOpen: isOpen });
    }

    /**
     * Callback invoked to select a frame rate from the select dropdown.
     *
     * @param {Object} e - The key event to handle.
     * @private
     * @returns {void}
     */
    _onFramerateItemSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const frameRate = e.currentTarget.getAttribute('data-framerate');

        super._onChange({ currentFramerate: frameRate });
    }

    /**
     * Callback invoked to toggle display of the language select dropdown.
     *
     * @param {Object} event - The event for opening or closing the dropdown.
     * @private
     * @returns {void}
     */
    _onLanguageDropdownOpenChange({ isOpen }: { isOpen: boolean }) {
        // @ts-ignore
        this.setState({ isLanguageSelectOpen: isOpen });
    }

    /**
     * Callback invoked to select a language from select dropdown.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onLanguageItemSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const language = e.currentTarget.getAttribute('data-language');

        super._onChange({ currentLanguage: language });
    }

    /**
     * Callback invoked to select if the lobby
     * should be shown.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onShowPrejoinPageChanged({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) {
        super._onChange({ showPrejoinPage: checked });
    }

    /**
     * Callback invoked to select if the given type of
     * notifications should be shown.
     *
     * @param {Object} e - The key event to handle.
     * @param {string} type - The type of the notification.
     *
     * @returns {void}
     */
    _onEnabledNotificationsChanged({ target: { checked } }: React.ChangeEvent<HTMLInputElement>, type: any) {
        super._onChange({
            enabledNotifications: {
                // @ts-ignore
                ...this.props.enabledNotifications,
                [type]: checked
            }
        });
    }

    /**
     * Callback invoked to select if global keyboard shortcuts
     * should be enabled.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onKeyboardShortcutEnableChanged({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) {
        keyboardShortcut.enable(checked);
        super._onChange({ keyboardShortcutEnable: checked });
    }

    /**
     * Callback invoked to select if hide self view should be enabled.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onHideSelfViewChanged({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) {
        super._onChange({ hideSelfView: checked });
    }

    /**
     * Callback invoked to toggle display of the max stage participants select dropdown.
     *
     * @param {Object} event - The event for opening or closing the dropdown.
     * @private
     * @returns {void}
     */
    _onMaxStageParticipantsOpenChange({ isOpen }: { isOpen: boolean }) {
        // @ts-ignore
        this.setState({ isMaxStageParticipantsOpen: isOpen });
    }

    /**
     * Callback invoked to select a max number of stage participants from the select dropdown.
     *
     * @param {Object} e - The key event to handle.
     * @private
     * @returns {void}
     */
    _onMaxStageParticipantsSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const maxParticipants = e.currentTarget.getAttribute('data-maxparticipants');

        super._onChange({ maxStageParticipants: maxParticipants });
    }

    /**
     * Returns the React Element for the desktop share frame rate dropdown.
     *
     * @returns {ReactElement}
     */
    _renderFramerateSelect() {
        // @ts-ignore
        const { currentFramerate, desktopShareFramerates, t } = this.props;
        const frameRateItems = desktopShareFramerates.map((frameRate: string) => (
            <DropdownItem
                data-framerate = { frameRate }
                key = { frameRate }
                onClick = { this._onFramerateItemSelect }>
                { `${frameRate} ${t('settings.framesPerSecond')}` }
            </DropdownItem>));

        return (
            <div
                className = 'settings-sub-pane-element'
                key = 'frameRate'>
                <h2 className = 'mock-atlaskit-label'>
                    { t('settings.desktopShareFramerate') }
                </h2>
                <div className = 'dropdown-menu'>
                    <TouchmoveHack
                        flex = { true }
                        isModal = { true }>
                        <DropdownMenu
                            // @ts-ignore
                            isOpen = { this.state.isFramerateSelectOpen }
                            onOpenChange = { this._onFramerateDropdownOpenChange }
                            shouldFitContainer = { true }
                            trigger = { currentFramerate
                                ? `${currentFramerate} ${t('settings.framesPerSecond')}`
                                : '' }
                            triggerButtonProps = {{
                                shouldFitContainer: true
                            }}
                            triggerType = 'button'>
                            <DropdownItemGroup>
                                { frameRateItems }
                            </DropdownItemGroup>
                        </DropdownMenu>
                    </TouchmoveHack>
                </div>
                <div
                    className = 'mock-atlaskit-label'>
                    { parseInt(currentFramerate, 10) > SS_DEFAULT_FRAME_RATE
                        ? t('settings.desktopShareHighFpsWarning')
                        : t('settings.desktopShareWarning') }
                </div>
            </div>
        );
    }

    /**
     * Returns the React Element for keyboardShortcut settings.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderKeyboardShortcutCheckbox() {
        // @ts-ignore
        const { t } = this.props;

        return (
            <div
                className = 'settings-sub-pane-element'
                key = 'keyboard-shortcut'>
                <h2 className = 'mock-atlaskit-label'>
                    { t('keyboardShortcuts.keyboardShortcuts') }
                </h2>
                <Checkbox
                    checked = { keyboardShortcut.getEnabled() }
                    label = { t('prejoin.keyboardShortcuts') }
                    name = 'enable-keyboard-shortcuts'
                    onChange = { this._onKeyboardShortcutEnableChanged } />
            </div>
        );
    }

    /**
     * Returns the React Element for self view setting.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderSelfViewCheckbox() {
        // @ts-ignore
        const { hideSelfView, t } = this.props;

        return (
            <div
                className = 'settings-sub-pane-element'
                key = 'selfview'>
                <h2 className = 'mock-atlaskit-label'>
                    { t('settings.selfView') }
                </h2>
                <Checkbox
                    checked = { hideSelfView }
                    label = { t('videothumbnail.hideSelfView') }
                    name = 'hide-self-view'
                    onChange = { this._onHideSelfViewChanged } />
            </div>
        );
    }

    /**
     * Returns the menu item for changing displayed language.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderLanguageSelect() {
        const {
            currentLanguage,
            languages,
            t
        // @ts-ignore
        } = this.props;

        const languageItems
            = languages.map((language: string) => (
                <DropdownItem
                    data-language = { language }
                    key = { language }
                    onClick = { this._onLanguageItemSelect }>
                    { t(`languages:${language}`) }
                </DropdownItem>));

        return (
            <div
                className = 'settings-sub-pane-element'
                key = 'language'>
                <h2 className = 'mock-atlaskit-label'>
                    { t('settings.language') }
                </h2>
                <div className = 'dropdown-menu'>
                    <TouchmoveHack
                        flex = { true }
                        isModal = { true }>
                        <DropdownMenu
                            // @ts-ignore
                            isOpen = { this.state.isLanguageSelectOpen }
                            onOpenChange = { this._onLanguageDropdownOpenChange }
                            shouldFitContainer = { true }
                            trigger = { currentLanguage
                                ? t(`languages:${currentLanguage}`)
                                : '' }
                            triggerButtonProps = {{
                                shouldFitContainer: true
                            }}
                            triggerType = 'button'>
                            <DropdownItemGroup>
                                { languageItems }
                            </DropdownItemGroup>
                        </DropdownMenu>
                    </TouchmoveHack>
                </div>
            </div>
        );
    }

    /**
     * Returns the React Element for modifying prejoin screen settings.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderPrejoinScreenSettings() {
        // @ts-ignore
        const { t, showPrejoinPage } = this.props;

        return (
            <div
                className = 'settings-sub-pane-element'
                key = 'prejoin-screen'>
                <h2 className = 'mock-atlaskit-label'>
                    { t('prejoin.premeeting') }
                </h2>
                <Checkbox
                    checked = { showPrejoinPage }
                    label = { t('prejoin.showScreen') }
                    name = 'show-prejoin-page'
                    onChange = { this._onShowPrejoinPageChanged } />
            </div>
        );
    }

    /**
     * Returns the React Element for modifying the enabled notifications settings.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderNotificationsSettings() {
        // @ts-ignore
        const { t, enabledNotifications } = this.props;

        return (
            <div
                className = 'settings-sub-pane-element'
                key = 'notifications'>
                <h2 className = 'mock-atlaskit-label'>
                    { t('notify.displayNotifications') }
                </h2>
                {
                    Object.keys(enabledNotifications).map(key => (
                        <Checkbox
                            checked = { enabledNotifications[key] }
                            key = { key }
                            label = { t(key) }
                            name = { `show-${key}` }
                            /* eslint-disable-next-line react/jsx-no-bind */
                            onChange = { e => this._onEnabledNotificationsChanged(e, key) } />
                    ))
                }
            </div>
        );
    }

    /**
     * Returns the React Element for the max stage participants dropdown.
     *
     * @returns {ReactElement}
     */
    _renderMaxStageParticipantsSelect() {
        // @ts-ignore
        const { maxStageParticipants, t, stageFilmstripEnabled } = this.props;

        if (!stageFilmstripEnabled) {
            return null;
        }
        const maxParticipantsItems = Array(MAX_ACTIVE_PARTICIPANTS).fill(0)
            .map((no, index) => (
                <DropdownItem
                    data-maxparticipants = { index + 1 }
                    key = { index + 1 }
                    onClick = { this._onMaxStageParticipantsSelect }>
                    {index + 1}
                </DropdownItem>));

        return (
            <div
                className = 'settings-sub-pane-element'
                key = 'maxStageParticipants'>
                <h2 className = 'mock-atlaskit-label'>
                    { t('settings.maxStageParticipants') }
                </h2>
                <div className = 'dropdown-menu'>
                    <TouchmoveHack
                        flex = { true }
                        isModal = { true }>
                        <DropdownMenu
                            // @ts-ignore
                            isOpen = { this.state.isMaxStageParticipantsOpen }
                            onOpenChange = { this._onMaxStageParticipantsOpenChange }
                            shouldFitContainer = { true }
                            trigger = { maxStageParticipants }
                            triggerButtonProps = {{
                                shouldFitContainer: true
                            }}
                            triggerType = 'button'>
                            <DropdownItemGroup>
                                { maxParticipantsItems }
                            </DropdownItemGroup>
                        </DropdownMenu>
                    </TouchmoveHack>
                </div>
            </div>
        );
    }

    /**
     * Returns the React element that needs to be displayed on the right half of the more tabs.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderSettingsRight() {
        // @ts-ignore
        const { showLanguageSettings } = this.props;

        return (
            <div
                className = 'settings-sub-pane right'
                key = 'settings-sub-pane-right'>
                { showLanguageSettings && this._renderLanguageSelect() }
                { this._renderFramerateSelect() }
                { this._renderMaxStageParticipantsSelect() }
            </div>
        );
    }

    /**
     * Returns the React element that needs to be displayed on the left half of the more tabs.
     *
     * @returns {ReactElement}
     */
    _renderSettingsLeft() {
        // @ts-ignore
        const { disableHideSelfView, showNotificationsSettings, showPrejoinSettings } = this.props;

        return (
            <div
                className = 'settings-sub-pane left'
                key = 'settings-sub-pane-left'>
                { showPrejoinSettings && this._renderPrejoinScreenSettings() }
                { showNotificationsSettings && this._renderNotificationsSettings() }
                { this._renderKeyboardShortcutCheckbox() }
                { !disableHideSelfView && this._renderSelfViewCheckbox() }
            </div>
        );
    }
}

// @ts-ignore
export default translate(MoreTab);
