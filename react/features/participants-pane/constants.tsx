import React from 'react';

import Icon from '../base/icons/components/Icon';
import {
    IconCameraEmpty,
    IconCameraEmptyDisabled,
    IconMicrophoneEmpty,
    IconMicrophoneEmptySlash
} from '../base/icons/svg';

/**
 * Reducer key for the feature.
 */
export const REDUCER_KEY = 'features/participants-pane';

export type ActionTrigger = 'Hover' | 'Permanent'

/**
 * Enum of possible participant action triggers.
 */
export const ACTION_TRIGGER: { HOVER: ActionTrigger, PERMANENT: ActionTrigger } = {
    HOVER: 'Hover',
    PERMANENT: 'Permanent'
};

export type MediaState = 'DominantSpeaker' | 'Muted' | 'ForceMuted' | 'Unmuted' | 'None';

/**
 * Enum of possible participant media states.
 */
export const MEDIA_STATE: { [key: string]: MediaState } = {
    DOMINANT_SPEAKER: 'DominantSpeaker',
    MUTED: 'Muted',
    FORCE_MUTED: 'ForceMuted',
    UNMUTED: 'Unmuted',
    NONE: 'None'
};

export type QuickActionButtonType = 'Mute' | 'AskToUnmute' | 'None';

/**
 * Enum of possible participant mute button states.
 */
export const QUICK_ACTION_BUTTON: {
    ASK_TO_UNMUTE: QuickActionButtonType,
    MUTE: QuickActionButtonType,
    NONE: QuickActionButtonType
} = {
    MUTE: 'Mute',
    ASK_TO_UNMUTE: 'AskToUnmute',
    NONE: 'None'
};

/**
 * Icon mapping for possible participant audio states.
 */
export const AudioStateIcons = {
    [MEDIA_STATE.DOMINANT_SPEAKER]: (
        <Icon
            className = 'jitsi-icon-dominant-speaker'
            size = { 16 }
            src = { IconMicrophoneEmpty } />
    ),
    [MEDIA_STATE.FORCE_MUTED]: (
        <Icon
            color = '#E04757'
            size = { 16 }
            src = { IconMicrophoneEmptySlash } />
    ),
    [MEDIA_STATE.MUTED]: (
        <Icon
            size = { 16 }
            src = { IconMicrophoneEmptySlash } />
    ),
    [MEDIA_STATE.UNMUTED]: (
        <Icon
            size = { 16 }
            src = { IconMicrophoneEmpty } />
    ),
    [MEDIA_STATE.NONE]: null
};

/**
 * Icon mapping for possible participant video states.
 */
export const VideoStateIcons = {
    [MEDIA_STATE.DOMINANT_SPEAKER]: null,
    [MEDIA_STATE.FORCE_MUTED]: (
        <Icon
            color = '#E04757'
            id = 'videoMuted'
            size = { 16 }
            src = { IconCameraEmptyDisabled } />
    ),
    [MEDIA_STATE.MUTED]: (
        <Icon
            id = 'videoMuted'
            size = { 16 }
            src = { IconCameraEmptyDisabled } />
    ),
    [MEDIA_STATE.UNMUTED]: (
        <Icon
            size = { 16 }
            src = { IconCameraEmpty } />
    ),
    [MEDIA_STATE.NONE]: null
};

/**
 * Mobile web context menu avatar size.
 */
export const AVATAR_SIZE = 20;
