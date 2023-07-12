import AppError from '@shared/errors/AppError';
import ConverterString from '@shared/validator/ConverterString';
import axios from 'axios';

async function BuscarMunicipios(
  ufSigla: string,
  ufNome: string,
  nomeMunicipio: string
): Promise<void> {
  const municipios = await axios.get(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSigla}/municipios`
  );
  const municipiosReais = municipios.data.map(
    (municipio: any) => municipio.nome
  );

  if (municipiosReais?.length) {
    const municipioVerificado = municipiosReais?.filter(
      (municipioAtual: string) =>
        ConverterString.replaceAndToUpperCase(municipioAtual) ===
        ConverterString.replaceAndToUpperCase(nomeMunicipio)
    );
    if (municipioVerificado.length === 0) {
      throw new AppError(
        `Não existe esse Município de nome: '${nomeMunicipio}' na UF: '${ufNome}'`,
        404
      );
    }
  }
  return;
}
export default BuscarMunicipios;
