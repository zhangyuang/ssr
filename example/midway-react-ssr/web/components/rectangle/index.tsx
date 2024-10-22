import styles from './index.module.less'

function Rectangle(props) {
	const data = props.data[0]
	return (
		<div className={styles.pbbContainer}>
			{data.itemMap.map((val) => {
				const imgUrl = val.img
				return (
					<div className={styles.pbbItemContainer} key={val.img} onClick={() => props.history.push('/detail/cbba934b14f747049187')}>
						<div className={styles.pbbDescContainer}>
							<div
								className={styles.defaultItemBg}
								style={{
									background: `url('${imgUrl}') 0  0 /cover`
								}}
							/>
							<div className={`${styles.pName} ${styles.pbbName}`}>{val.title}</div>
							<div className={`${styles.pDesc} ${styles.pbbName}`}>{val.subtitle}</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default Rectangle
