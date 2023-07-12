import BairroRepository from '@modules/bairro/typeorm/repositories/BairroRepository';
import { getCustomRepository } from 'typeorm';

async function AlteracaoMunicipioStatusService(
  codigoMunicipio: number,
  status: number
): Promise<void> {
  const bairroRepository = getCustomRepository(BairroRepository);

  const bairros = await bairroRepository.findByCodigoMunicipio(codigoMunicipio);
  if (bairros.length) {
    for (const bairro of bairros) {
      if (bairro.status !== status) {
        bairro.status = status;
        await bairroRepository.save(bairro);
      }
    }
  }
}

export default AlteracaoMunicipioStatusService;
