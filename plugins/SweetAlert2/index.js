/**
 * SweetAlert 封裝
 *
 * @since 0.0.1
 * @version 0.0.1
 * @author MPWEI
 * @date 2020/01/23
 */

import Vue from 'vue'
import swal from 'sweetalert2'

Vue.prototype.$Swal = swal.mixin({
  icon: 'success',
  showCancelButton: true
})
