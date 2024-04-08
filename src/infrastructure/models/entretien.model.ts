import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "entretiens",
})
export default class Entretien extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id"
  })
  id?: number;

  @Column({
    type: DataType.STRING,
    field: "horaire"
  })
  horaire?: string;

  @Column({
    type: DataType.INTEGER,
    field: "candidatId"
  })
  candidatId?: number;

  @Column({
    type: DataType.INTEGER,
    field: "recruteurId"
  })
  recruteurId?: number;
}
