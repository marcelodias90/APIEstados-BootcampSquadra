import EnderecoRepository from '@modules/endereco/typeorm/repositories/EnderecoRepository';
import PessoaRepository from '@modules/pessoa/typeorm/repositories/PessoaRepository';
import { getCustomRepository } from 'typeorm';

async function DelecaoCascataBairroService(codigoBairro: number) {
  const enderecoRepository = getCustomRepository(EnderecoRepository);
  const pessoaRepository = getCustomRepository(PessoaRepository);

  const enderecos = await enderecoRepository.findByCodigoBairro(codigoBairro);

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
}

export default DelecaoCascataBairroService;
