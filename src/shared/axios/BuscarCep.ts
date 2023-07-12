import BairroRepository from '@modules/bairro/typeorm/repositories/BairroRepository';
import Endereco from '@modules/endereco/typeorm/entities/Endereco';
import MunicipioRepository from '@modules/municipio/typeorm/repositories/MunicipioRepository';
import CepMunicipioErradoError from '@shared/errors/exceptions/CepMunicipioErradoError';
import CepNaoExisteError from '@shared/errors/exceptions/CepNaoExisteError';
import RuaErradoErorr from '@shared/errors/exceptions/RuaErradoErorr';

import ConverterString from '@shared/validator/ConverterString';
import axios from 'axios';
import { getCustomRepository } from 'typeorm';

async function BuscarCep(enderecos: Endereco[]): Promise<void> {
  try {
    await Promise.all(
      enderecos.map(async endereco => {
        const bairroRepository = getCustomRepository(BairroRepository);
        const municipioRepository = getCustomRepository(MunicipioRepository);

        const enderecoEncontrado = await axios.get(
          `https://viacep.com.br/ws/${endereco.cep}/json`
        );

        if (enderecoEncontrado.data.erro) {
          throw new CepNaoExisteError('Cep', endereco.codigoBairro);
        }

        const bairro = await bairroRepository.findOne(endereco.codigoBairro);
        if (bairro) {
          const municipio = await municipioRepository.findOne(
            bairro.codigoMunicipio
          );
          if (municipio) {
            if (
              ConverterString.replaceAndToUpperCase(
                enderecoEncontrado.data.localidade
              ) !== municipio.nome
            ) {
              throw new CepMunicipioErradoError(municipio.nome, endereco.cep);
            }
            if (enderecoEncontrado.data.logradouro !== '') {
              if (
                ConverterString.replaceAndToUpperCase(
                  enderecoEncontrado.data.logradouro
                ) !== ConverterString.replaceAndToUpperCase(endereco.nomeRua)
              ) {
                throw new RuaErradoErorr(endereco.nomeRua, endereco.cep);
              }
            }
          }
        }
        return;
      })
    );
  } catch (erro) {
    if (erro instanceof CepNaoExisteError) {
      console.log(erro);
      throw new CepNaoExisteError('Cep', erro.codigoBairro);
    }
    if (erro instanceof CepMunicipioErradoError) {
      console.log(erro);
      throw new CepMunicipioErradoError(erro.nomeMunicipio, erro.cep);
    }
    if (erro instanceof RuaErradoErorr) {
      throw new RuaErradoErorr(erro.nomeRua, erro.campo);
    }
  }
}
export default BuscarCep;
