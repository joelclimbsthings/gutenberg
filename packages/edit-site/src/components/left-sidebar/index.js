/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import InserterPanel from './inserter-panel';
import NavigationPanel from './navigation-panel';

const LeftSidebar = () => {
	const { isNavigationOpen, isInserterOpen } = useSelect( ( select ) => {
		const { getNavigationIsOpen, getInserterIsOpen } = select(
			'core/edit-site'
		);
		return {
			isNavigationOpen: getNavigationIsOpen(),
			isInserterOpen: getInserterIsOpen(),
		};
	} );

	const { setInserterOpen } = useDispatch( 'core/edit-site' );

	if ( isNavigationOpen ) {
		return <NavigationPanel />;
	}

	if ( isInserterOpen ) {
		return (
			<InserterPanel closeInserter={ () => setInserterOpen( false ) } />
		);
	}

	return null;
};

export default LeftSidebar;
