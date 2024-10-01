import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "candidats",
})
export default class SqlCandidat extends Model {
  @Column({
    type: DataType.STRING(255),
    primaryKey: true,
    field: "id"
  })
  id?: String;

  @Column({
    type: DataType.STRING(255),
    field: "langage"
  })
  langage?: string;

  @Column({
    type: DataType.STRING(255),
    field: "email"
  })
  email?: string;

  @Column({
    type: DataType.INTEGER,
    field: "xp"
  })
  xp?: number;
}
