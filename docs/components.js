function defaultComponent(props) {
	return React.createElement(
		'div',
		{ className: props.dataNodeName },
		props.children
	)
}

function rs(props) {
	const style = {
		backgroundColor: 'inherit',
		borderBottomColor: props.__color,
		color: 'initial',
	}

	if (props.activeId === props.__id) {
		style.backgroundColor = props.__color
		style.color = 'white'
	}

	return React.createElement(
		'div',
		{ className: 'rs', onClick: props.onClick, style },
		props.children
	)
}

export default {
	div: defaultComponent,
	head: defaultComponent,
	lb: defaultComponent,
	p: defaultComponent,
	rs,
	geo: rs,
}
