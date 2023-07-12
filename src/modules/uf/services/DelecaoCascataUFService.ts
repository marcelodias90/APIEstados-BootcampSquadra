import BairroRepository from '@modules/bairro/typeorm/repositories/BairroRepository';
import EnderecoRepository from '@modules/endereco/typeorm/repositories/EnderecoRepository';
import MunicipioRepository from '@modules/municipio/typeorm/repositories/MunicipioRepository';
import PessoaRepository from '@modules/pessoa/typeorm/repositories/PessoaRepository';
import { getCustomRepository } from 'typeorm';

async function DelecaoCascataUFService(codigoUF: number): Promise<void> {
  const municipioRespository = getCustomRepository(MunicipioRepository);
  const bairroRepository = getCustomRepository(BairroRepository);
  const enderecoRepository = getCustomRepository(EnderecoRepository);
  const pessoaRepository = getCustomRepository(PessoaRepository);

  const municipios = await municipioRespository.findByCodigoUF(codigoUF);

  for (const municipio of municipios) {
    const bairros = await bairroRepository.findByCodigoMunicipio(
      municipio.codigoMunicipio
    );

    for (const bairro of bairros) {
      const enderecos = await enderecoRepository.findByCodigoBairro(
        bairro.codigoBairro
      );

      for (const endereco of enderecos) {
        await enderecoRepository.remove(endereco);
        const enderecoPessoa = await enderecoRepository.findByCodigoPessoa(
          endereco.codigoPessoa
        );
        if (enderecoPessoa.length === 0) {
          const pessoa = await pessoaRepository.findByCodigoPessoa(
            endereco.codigoPessoa
          );
          if (pessoa) {
            await pessoaRepository.remove(pessoa);
          }
        }
      }
      await bairroRepository.remove(bairro);
    }
    await municipioRespository.remove(municipio);
  }
}

export default DelecaoCascataUFService;
