module.exports = (sequelize, DataTypes) => {
  const { TEXT, GEOMETRY } = DataTypes;
  const UserGeometryModel = sequelize.define(
    "user_geometry",
    {
      auth0_sub: {
        type: TEXT,
        primaryKey: true,
      },
      geometry: {
        type: GEOMETRY,
        primaryKey: true
      },
    },
    {
      timestamps: false,
      schema: "web",
      freezeTableName: true,
    }
  );
  return UserGeometryModel;
};
