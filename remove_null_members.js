db.couples.updateMany({}, { $pull: { members: null } })
