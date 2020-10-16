module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER } = DataTypes;
  const ExampleTable = sequelize.define(
    "example_table",
    {
      example_ndx: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      example_name: {
        type: TEXT,
      },
    },
    {
      timestamps: false,
      schema: "example_schema",
      freezeTableName: true,
    }
  );
  return ExampleTable;
};
