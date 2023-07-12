import Endereco from '@modules/endereco/typeorm/entities/Endereco';
import ValidarCampo from './ValidarCampo';

class ValidarObjetoEndereco {
  public static execute(enderecos: Endereco[]) {
    enderecos.map(endereco => {
      ValidarCampo.validarCodigoCampo(endereco.codigoBairro, 'codigoBairro');
      ValidarCampo.validaNomeRuaCampo(endereco.nomeRua, 'nomeRua');
      ValidarCampo.validaNumeroCampo(endereco.numero, 'numero');
      ValidarCampo.validaComplementoCampo(endereco.complemento, 'complemento');
      ValidarCampo.validarCampoCep(endereco.cep, 'cep');
    });
  }
}

export default ValidarObjetoEndereco;
