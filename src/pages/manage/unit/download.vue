<template>
  <section id="Issue" class="AdminContent">
    <div class="container">
      <div class="my-3 p-3 bg-white rounded shadow-sm">
        <h1 class="font-weight-bold border-bottom pb-3 h4 mb-3 d-flex justify-content-between">
          {{ $t('Manage.Menu.Issue') }}
          <div class="d-flex flex-row">
            <b-form-file
              v-model="File"
              size="sm"
              :browse-text="$t('Global.Browse')"
              :placeholder="$t('Manage.Post.PostAdd/UploadPlaceholder')"
              :rop-placeholder="$t('Manage.Post.PostAdd/DropPlaceholder')" />
            <b-button variant="dark" size="sm" type="button" class="ml-2 w-25" @click="UploadFile">
              <i class="fa fa-plus-circle" aria-hidden="true" /> {{ $t('Global.Upload') }}
            </b-button>
          </div>
        </h1>
        <div v-if="Loading" class="text-center p-5">
          <b-spinner label="Loading..." />
        </div>
        <draggable
            v-model="FileList"
            class="row no-gutters mx-n1"
            tag="div"
            v-bind="DragOptions"
            @start="Drag = true"
            @end="Drag = false"
          >
          <div v-for="(FileData, Index) in FileList" :key="Index" class="col-lg-3 col-md-4 col-sm-6 col-12 px-1">
            <div v-b-modal.FileModal class="card FileItem" @click="GetFileMeta(FileData)">
              <div class="card-body p-3">
                <h6 class="card-title mb-0 text-truncate">
                  <i class="fa fa-file-text-o mr-1" /> {{ FileData.Name }}
                </h6>
              </div>
            </div>
          </div>
        </draggable>
        <div v-if="(FileList.length === 0 && !Loading)" class="text-center p-5">
          {{ $t('Message.Manage.global/no-items') }}
        </div>
      </div>
    </div>
    <b-modal
      id="FileModal"
      :title="$t('Manage.Unit.MetaData')"
      :ok-title="$t('Manage.Unit.Download')"
      :cancel-title="$t('Manage.Unit.Delete')"
      cancel-variant="danger"
      ok-variant="success"
      @ok="DownloadFile(FileMeta.Path)"
      @cancel="DeleteFile(FileMeta.Path)"
    >
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <b>{{ $t('Manage.Unit.FileName') }}:</b> {{ FileMeta.Name }}
        </li>
        <li class="list-group-item">
          <b>{{ $t('Manage.Unit.FileSize') }}:</b> {{ FileMeta.Size }}
        </li>
        <li class="list-group-item">
          <b>{{ $t('Manage.Unit.FileType') }}:</b> {{ FileMeta.Type }}
        </li>
        <li class="list-group-item">
          <b>{{ $t('Manage.Unit.FileNewTime') }}:</b> {{ FileMeta.NewTime }}
        </li>
        <li class="list-group-item">
          <b>{{ $t('Manage.Unit.FileUpdate') }}:</b> {{ FileMeta.UpdateTime }}
        </li>
      </ul>
    </b-modal>
  </section>
</template>

<script>
import Vue from 'vue'
import { FormFilePlugin, ModalPlugin } from 'bootstrap-vue'
Vue.use(FormFilePlugin)
Vue.use(ModalPlugin)

export default {
  layout: 'ManageLayout',
  middleware: [
    'ManageAuth'
  ],
  components: {
    draggable: () => import('vuedraggable')
  },
  data () {
    return {
      Loading: true,
      FileList: [],
      Prefix: '',
      PageToken: '',
      File: null,
      FileMeta: {},
      Drag: false
    }
  },
  computed: {
    DragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      this.Init().then(() => {
        this.$nuxt.$loading.finish()
        this.Loading = false
      }).catch(() => {
        this.$nuxt.$loading.finish()
      })
    })
  },
  methods: {
    Init () {
      return Promise.all([
        this.GetFiles()
      ])
    },
    async GetFiles (_PageItem = 20, _PageToken = '') {
      this.FileList = []
      this.Loading = true
      const FileData = await this.$Firebase('storage').ref('data').list({
        maxResults: _PageItem
      })
      FileData.items.forEach((File) => {
        this.FileList.push({
          Name: File.name,
          Path: File.fullPath
        })
      })
      this.Loading = false
      this.Prefix = FileData.prefixes
      this.PageToken = FileData.nextPageToken
    },
    DownloadFile (_Path) {
      this.$Firebase('storage').ref().child(_Path).getDownloadURL().then((_URL) => {
        window.open(_URL, _URL)
      }).catch((_Error) => {
        alert(_Error)
      })
    },
    UploadFile () {
      if (!this.File) {
        this.$Swal.fire({
          icon: 'error',
          title: this.$t('Message.Error'),
          text: this.$t('Message.Manage.media/no-filename')
        })
        return
      }
      this.Loading = true
      const MetaData = {
        contentType: this.File.type,
        customMetadata: {
          Origin: 'MediaStore',
          Identify: 'youthjob-researchproject-aaa0e'
        }
      }
      this.$Firebase('storage').ref('data/' + this.File.name).put(this.File, MetaData).then((response) => {
        this.$Swal.fire({
          icon: 'success',
          title: this.$t('Message.Success'),
          text: this.$t('Message.Manage.unit/upload-success')
        })
        this.GetFiles()
        this.File = null
        this.Loading = false
      }).catch((_Error) => {
        alert(_Error)
      })
    },
    GetFileMeta (_Data) {
      this.FileMeta = {}
      this.$Firebase('storage').ref().child(_Data.Path).getMetadata().then((MetaData) => {
        this.FileMeta = {
          Name: MetaData.name,
          Size: this.GetReadableFileSizeString(MetaData.size),
          Path: MetaData.fullPath,
          Type: MetaData.type,
          NewTime: this.$dayjs(MetaData.timeCreated).format('YYYY-MM-DD HH:mm:ss'),
          UpdateTime: this.$dayjs(MetaData.updated).format('YYYY-MM-DD HH:mm:ss')
        }
      })
    },
    DeleteFile (_Path) {
      this.$Swal.fire({
        icon: 'warning',
        title: this.$t('Message.AskDelete'),
        text: this.$t('Message.Manage.post/delete-confirm'),
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('Global.Confirm'),
        cancelButtonText: this.$t('Global.Cancel')
      }).then((Result) => {
        if (Result.value) {
          this.$Firebase('storage').ref(_Path).delete().then((response) => {
            this.$Swal.fire({
              icon: 'success',
              title: this.$t('Message.Success'),
              text: this.$t('Message.Manage.unit/delete-success')
            })
            this.GetFiles()
          }).catch((_Error) => {
            this.$Swal.fire({
              icon: 'error',
              title: this.$t('Message.Error'),
              text: this.$t('Message.Manage.unit/delete-fail') + ': ' + _Error
            })
          })
        }
      })
    },
    /**
     * @return {string}
     */
    GetReadableFileSizeString (_Bytes) {
      let i = -1
      const byteUnits = [' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB']
      do {
        _Bytes = _Bytes / 1024
        i++
      } while (_Bytes > 1024)

      return Math.max(_Bytes, 0.1).toFixed(1) + byteUnits[i]
    }
  },
  head () {
    // Set Meta Tags for this Page
  }
}
</script>

<style scoped>
  #Issue .FileItem {
    cursor: pointer;
    transition: background-color 0.3s;
  }
  #Issue .FileItem:hover {
    background-color: #f1f1f1;
  }
  .button {
    margin-top: 35px;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: 0.5;
    background: #9a9a9a;
  }
</style>
