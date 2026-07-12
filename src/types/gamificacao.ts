export type TipoEmblema = "tentativa" | "adaptacao" | "reflexao";

export interface Emblema {
  id: string;
  tipo: TipoEmblema;
  titulo: string;
  descricao: string;
  concedidoEm: string;
}
