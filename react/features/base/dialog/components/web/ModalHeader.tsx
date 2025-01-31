/* eslint-disable lines-around-comment */
/* eslint-disable react/no-multi-comp */
import ErrorIcon from '@atlaskit/icon/glyph/error';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import {
    Header,
    Title,
    titleIconWrapperStyles,
    TitleText
    // @ts-ignore
} from '@atlaskit/modal-dialog/dist/es2019/styled/Content';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { WithTranslation } from 'react-i18next';

import { translate } from '../../../i18n/functions';
import { IconClose } from '../../../icons/svg';
import { withPixelLineHeight } from '../../../styles/functions.web';
import Button from '../../../ui/components/web/Button';
import { BUTTON_TYPES } from '../../../ui/constants';

const TitleIcon = ({ appearance }: { appearance?: 'danger' | 'warning' }) => {
    if (!appearance) {
        return null;
    }

    const IconSymbol = appearance === 'danger' ? ErrorIcon : WarningIcon;

    return (
        <span css = { titleIconWrapperStyles(appearance) }>
            <IconSymbol label = { `${appearance} icon` } />
        </span>
    );
};

interface Props extends WithTranslation {
    appearance?: 'danger' | 'warning',
    classes: any,
    heading: string,
    hideCloseIconButton: boolean,
    id?: string,
    isHeadingMultiline: boolean,
    onClose: (e?: any) => void,
    showKeyline: boolean,
    testId?: string
}

/**
 * Creates the styles for the component.
 *
 * @param {Object} theme - The current UI theme.
 *
 * @returns {Object}
 */
const styles = (theme: any) => {
    return {
        closeButton: {
            borderRadius: theme.shape.borderRadius,
            cursor: 'pointer',
            padding: 13,

            [theme.breakpoints.down('480')]: {
                background: theme.palette.action02
            },

            '&:hover': {
                background: theme.palette.ui04
            }
        },
        header: {
            boxShadow: 'none',

            '& h4': {
                ...withPixelLineHeight(theme.typography.heading5),
                color: theme.palette.text01
            }
        }
    };
};


/**
 * A default header for modal-dialog components.
 *
 * @class ModalHeader
 * @augments {React.Component<Props>}
 */
class ModalHeader extends React.Component<Props> {
    static defaultProps = {
        isHeadingMultiline: true
    };

    /**
     * Initializes a new {@code ModalHeader} instance.
     *
     * @param {*} props - The read-only properties with which the new instance
     * is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        // Bind event handler so it is only bound once for every instance.
        this._onKeyPress = this._onKeyPress.bind(this);
    }

    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onKeyPress(e: React.KeyboardEvent) {
        if (this.props.onClose && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
            this.props.onClose();
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            id,
            appearance,
            classes,
            heading,
            hideCloseIconButton,
            onClose,
            showKeyline,
            isHeadingMultiline,
            testId,
            t
        } = this.props;

        if (!heading) {
            return null;
        }

        return (
            <Header
                className = { classes.header }
                showKeyline = { showKeyline }>
                <Title>
                    <TitleIcon appearance = { appearance } />
                    <TitleText
                        data-testid = { testId && `${testId}-heading` }
                        id = { id }
                        isHeadingMultiline = { isHeadingMultiline }>
                        {heading}
                    </TitleText>
                </Title>

                {
                    !hideCloseIconButton && <Button
                        accessibilityLabel = { t('dialog.close') }
                        icon = { IconClose }
                        id = 'modal-header-close-button'
                        onClick = { onClose }
                        size = 'large'
                        type = { BUTTON_TYPES.TERTIARY } />
                }
            </Header>
        );
    }
}
export default translate(withStyles(styles)(ModalHeader));
