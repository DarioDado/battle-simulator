exports.addArmy = (req, res) => {
	const { name, units, attackStrategy } = req.body;

	// addArmy

	res.json({
		status: 200,
		data: {
			message: 'test add army',
			data: { name, units, attackStrategy },
		},
	});
};
