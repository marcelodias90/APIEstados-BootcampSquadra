import BairroRepository from '@modules/bairro/typeorm/repositories/BairroRepository';
import EnderecoRepository from '@modules/endereco/typeorm/repositories/EnderecoRepository';
import PessoaRepository from '@modules/pessoa/typeorm/repositories/PessoaRepository';
import { getCustomRepository } from 'typeorm';

async function DelecaoCascataMunicipioService(codigoMunicipio: number) {
  const bairroRepository = getCustomRepository(BairroRepository);
  const enderecoRepository = getCustomRepository(EnderecoRepository);
  const pessoaRepository = getCustomRepository(PessoaRepository);

  const bairros = await bairroRepository.findByCodigoMunicipio(codigoMunicipio);

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
}
export default DelecaoCascataMunicipioService;
