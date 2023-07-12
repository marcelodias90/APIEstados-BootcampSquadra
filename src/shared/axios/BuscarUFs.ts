import AppError from '@shared/errors/AppError';
import ConverterString from '@shared/validator/ConverterString';
import axios from 'axios';

async function BuscarUFs(ufNome: string, ufSigla: string): Promise<void> {
  const ufs = await axios.get(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados`
  );
  const ufsReais = ufs.data.map((uf: any) => uf);

  let ufNomeverificado;
  if (ufsReais?.length) {
    ufNomeverificado = ufsReais?.filter(
      (ufAtual: any) =>
        ConverterString.replaceAndToUpperCase(ufAtual.nome) ===
        ConverterString.replaceAndToUpperCase(ufNome)
    );
    if (ufNomeverificado.length === 0) {
      throw new AppError(
        `Não existe essa UF de nome: '${ufNome}' no Brasil.`,
        404
      );
    }
  }

  let ufSiglaVerificada;
  const siglas = await axios.get(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados`
  );
  const siglasReais = siglas.data.map((uf: any) => uf);

  if (siglasReais?.length) {
    ufSiglaVerificada = siglasReais?.filter(
      (ufSiglaAtual: any) =>
        ConverterString.replaceAndToUpperCase(ufSiglaAtual.sigla) ===
        ConverterString.replaceAndToUpperCase(ufSigla)
    );
    if (ufSiglaVerificada.length === 0) {
      throw new AppError(`Não existe essa Sigla: '${ufSigla}' no Brasil.`, 404);
    }
  }

  if (ufNomeverificado[0].nome !== ufSiglaVerificada[0].nome) {
    throw new AppError(
      `Esse UF: '${ufNome}' não pertence a essa Sigla: '${ufSigla}'`
    );
  }
}
export default BuscarUFs;
