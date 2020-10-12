/**
 * WordPress dependencies
 */
import { useViewportMatch } from '@wordpress/compose';
import {
	BlockNavigationDropdown,
	ToolSelector,
	BlockToolbar,
	__experimentalPreviewOptions as PreviewOptions,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	PinnedItems,
	__experimentalMainDashboardButton as MainDashboardButton,
} from '@wordpress/interface';
import { _x } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import MoreMenu from './more-menu';
import PageSwitcher from '../page-switcher';
import SaveButton from '../save-button';
import UndoButton from './undo-redo/undo';
import RedoButton from './undo-redo/redo';
import DocumentActions from './document-actions';
import NavigationToggle from './navigation-toggle';
import TemplateDetails from '../template-details';
import { getTemplateInfo } from '../../utils';

export default function Header( {
	openEntitiesSavedStates,
	isInserterOpen,
	onToggleInserter,
	isNavigationOpen,
	onToggleNavigation,
} ) {
	const {
		deviceType,
		hasFixedToolbar,
		template,
		templatePart,
		page,
		showOnFront,
		templateType,
	} = useSelect( ( select ) => {
		const {
			__experimentalGetPreviewDeviceType,
			isFeatureActive,
			getTemplateId,
			getTemplatePartId,
			getTemplateType,
			getPage,
		} = select( 'core/edit-site' );

		const { getEntityRecord, getEditedEntityRecord } = select( 'core' );
		const { show_on_front: _showOnFront } = getEditedEntityRecord(
			'root',
			'site'
		);
		const templatePartId = getTemplatePartId();
		const templateId = getTemplateId();

		return {
			deviceType: __experimentalGetPreviewDeviceType(),
			hasFixedToolbar: isFeatureActive( 'fixedToolbar' ),
			template: getEntityRecord( 'postType', 'wp_template', templateId ),
			templatePart: getEntityRecord(
				'postType',
				'wp_template_part',
				templatePartId
			),
			templateType: getTemplateType(),
			page: getPage(),
			showOnFront: _showOnFront,
		};
	}, [] );

	const {
		__experimentalSetPreviewDeviceType: setPreviewDeviceType,
		setPage,
	} = useDispatch( 'core/edit-site' );

	const isLargeViewport = useViewportMatch( 'medium' );
	const displayBlockToolbar =
		! isLargeViewport || deviceType !== 'Desktop' || hasFixedToolbar;

	let { title } = getTemplateInfo( template );
	if ( 'wp_template_part' === templateType ) {
		title = templatePart?.slug;
	}

	return (
		<div className="edit-site-header">
			<div className="edit-site-header_start">
				<MainDashboardButton.Slot>
					<NavigationToggle
						isOpen={ isNavigationOpen }
						onClick={ onToggleNavigation }
					/>
				</MainDashboardButton.Slot>
				<div className="edit-site-header__toolbar">
					<Button
						isPrimary
						isPressed={ isInserterOpen }
						className="edit-site-header-toolbar__inserter-toggle"
						onClick={ onToggleInserter }
						icon={ plus }
						label={ _x(
							'Add block',
							'Generic label for block inserter button'
						) }
					/>
					<ToolSelector />
					<UndoButton />
					<RedoButton />
					<BlockNavigationDropdown />
					{ displayBlockToolbar && (
						<div className="edit-site-header-toolbar__block-toolbar">
							<BlockToolbar hideDragHandle />
						</div>
					) }
					<div className="edit-site-header__toolbar-switchers">
						<PageSwitcher
							showOnFront={ showOnFront }
							activePage={ page }
							onActivePageChange={ setPage }
						/>
					</div>
				</div>
			</div>

			<div className="edit-site-header_center">
				<DocumentActions
					entityTitle={ title }
					entityLabel={
						templateType === 'wp_template'
							? 'template'
							: 'template part'
					}
				>
					{ templateType === 'wp_template' && (
						<TemplateDetails template={ template } />
					) }
				</DocumentActions>
			</div>

			<div className="edit-site-header_end">
				<div className="edit-site-header__actions">
					<PreviewOptions
						deviceType={ deviceType }
						setDeviceType={ setPreviewDeviceType }
					/>
					<SaveButton
						openEntitiesSavedStates={ openEntitiesSavedStates }
					/>
					<PinnedItems.Slot scope="core/edit-site" />
					<MoreMenu />
				</div>
			</div>
		</div>
	);
}
