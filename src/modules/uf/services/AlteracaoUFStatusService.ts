import BairroRepository from '@modules/bairro/typeorm/repositories/BairroRepository';
import MunicipioRepository from '@modules/municipio/typeorm/repositories/MunicipioRepository';
import { getCustomRepository } from 'typeorm';

async function AlteracaoUFStatusService(
  codigoUF: number,
  status: number
): Promise<void> {
  const municipioRespository = getCustomRepository(MunicipioRepository);
  const bairroRepository = getCustomRepository(BairroRepository);

  const municipios = await municipioRespository.findByCodigoUF(codigoUF);
  if (municipios.length) {
    for (const municipio of municipios) {
      if (municipio.status !== status) {
        municipio.status = status;
        await municipioRespository.save(municipio);
      }
      const bairros = await bairroRepository.findByCodigoMunicipio(
        municipio.codigoMunicipio
      );
      if (bairros.length) {
        for (const bairro of bairros) {
          if (bairro.status !== status) {
            bairro.status = status;
            await bairroRepository.save(bairro);
          }
        }
      }
    }
  }
}

export default AlteracaoUFStatusService;
