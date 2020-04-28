<template>
  <section id="Media" class="AdminContent">
    <div class="container">
      <div class="my-3 p-3 bg-white rounded shadow-sm">
        <h1 class="font-weight-bold border-bottom pb-3 h4 mb-3 d-flex justify-content-between">
          {{ $t('Manage.MediaStore') }}
          <div>
            <b-button v-b-modal.FileUpload variant="dark" size="sm" type="button">
              <i class="fa fa-plus-circle" aria-hidden="true" /> {{ $t('Global.Upload') }}
            </b-button>
          </div>
        </h1>
        <div v-if="Loading" class="text-center p-5">
          <b-spinner label="Loading..." />
        </div>
        <div class="row no-gutters mx-n1">
          <div v-for="(Data, Index) in FileList" :key="Index" class="col-xl-2 col-lg-3 col-md-4 col-6 px-1">
            <div class="card mb-4 shadow-sm rounded-0 FileItem">
              <b-card-img-lazy :src="Data.Cover" />
              <div class="card-body p-2">
                <small class="card-title text-truncate d-block">
                  {{ Data.Name }}
                </small>
              </div>
              <div class="card-overlay p-2">
                <button v-b-modal.FileModal type="button" class="btn mr-1 btn-sm btn-success" @click="GetFileMeta(Data)">
                  <i class="fa fa-eye" />
                </button>
                <button type="button" class="btn btn-sm btn-danger" @click="DeleteFile(Data, Index)">
                  <i class="fa fa-times" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="(FileList.length === 0 && !Loading)" class="text-center p-5">
          {{ $t('Message.Manage.global/no-items') }}
        </div>
      </div>
    </div>
    <b-modal
      id="FileModal"
      :title="$t('Manage.Media.FileMeta')"
      cancel-variant="danger"
      ok-variant="success"
      hide-footer="true"
      :ok-title="$t('Global.Save')"
      :cancel-title="$t('Global.Cancel')"
      @ok="SaveMeta()"
    >
      <div class="text-center">
        <img :src="FileMeta.Cover" alt="" class="img-fluid">
      </div>
    </b-modal>
    <b-modal
      id="FileUpload"
      :title="$t('Manage.Media.Upload')"
      cancel-variant="danger"
      ok-variant="success"
      :ok-title="$t('Manage.Media.DoUpload')"
      :cancel-title="$t('Global.Cancel')"
      @ok.prevent="UploadFile()"
    >
      <b-alert
        class="shadow"
        :show="(Upload.Message!== '')"
        :variant="Upload.State"
        fade
        dismissible
        @dismissed="Error = false">
        {{ Upload.Message }}
      </b-alert>
      <b-form-file
        v-model="File"
        multiple
        :browse-text="$t('Global.Browse')"
        :placeholder="$t('Manage.Post.PostAdd/UploadPlaceholder')"
        :rop-placeholder="$t('Manage.Post.PostAdd/DropPlaceholder')"
        class="mb-4"
      />
      <div v-if="File.length > 0" class="row">
        <div v-for="(Data, Index) in File" :key="Index" class="col-md-4 col-6 text-center">
          <figure class="figure">
            <i class="fa fa-3x fa-file-image-o mb-2" />
            <figcaption class="figure-caption text-center text-truncate d-block">
              {{ Data.name }}
            </figcaption>
          </figure>
        </div>
      </div>
    </b-modal>
  </section>
</template>

<script>
import Vue from 'vue'
import { FormFilePlugin, ModalPlugin, BCardImgLazy } from 'bootstrap-vue'

Vue.use(FormFilePlugin)
Vue.use(ModalPlugin)
Vue.component('b-card-img-lazy', BCardImgLazy)

export default {
  layout: 'ManageLayout',
  middleware: [
    'ManageAuth'
  ],
  fetch ({ store, params }) {
    // The fetch method is used to fill the store before rendering the page
  },
  data () {
    return {
      Loading: true,
      FileList: [],
      Prefix: '',
      PageToken: '',
      File: [],
      FileMeta: {},
      Upload: {
        Message: '',
        State: null
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
      const FileData = await this.$Firebase('storage').ref('uploads').list({
        maxResults: _PageItem
      })
      FileData.items.forEach((File) => {
        this.$Firebase('storage').ref().child(File.fullPath).getDownloadURL().then((_URL) => {
          this.FileList.push({
            Name: File.name,
            Path: File.fullPath,
            Cover: _URL
          })
        }).catch((_Error) => {
          alert(_Error)
        })
      })
      this.Loading = false
      this.Prefix = FileData.prefixes
      this.PageToken = FileData.nextPageToken
    },
    async UploadFile () {
      if (this.File.length === 0) {
        await this.$Swal.fire({
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
      await this.MutipleUpload(this.File, MetaData).then(() => {
        this.$Swal.fire({
          icon: 'success',
          title: this.$t('Message.Success'),
          text: this.$t('Message.Manage.unit/upload-success')
        }).then(() => {
          this.GetFiles()
          this.File = []
          this.Loading = false
        })
      })
    },
    MutipleUpload (_File, _MetaData) {
      return Promise.resolve(
        _File.forEach((FileData) => {
          this.$Firebase('storage').ref('uploads/' + FileData.name).put(FileData, _MetaData).catch((_Error) => {
            this.Upload.Message = _Error
            this.Upload.State = 'danger'
          })
        })
      )
    },
    GetFileMeta (_Data) {
      this.FileMeta = {}
      this.$Firebase('storage').ref().child(_Data.Path).getMetadata().then((MetaData) => {
        this.FileMeta = {
          Name: MetaData.name,
          Size: this.GetReadableFileSizeString(MetaData.size),
          Path: MetaData.fullPath,
          Cover: _Data.Cover,
          Type: MetaData.type,
          NewTimeAlt: this.$dayjs(MetaData.generation),
          NewTime: MetaData.timeCreated,
          UpdateTime: MetaData.updated
        }
      })
    },
    DeleteFile (_Data, _Index) {
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
          this.$Firebase('storage').ref(_Data.Path).delete().then((response) => {
            this.$Swal.fire({
              icon: 'success',
              title: this.$t('Message.Success'),
              text: this.$t('Message.Manage.unit/delete-success')
            })
            this.FileList.splice(_Index, 1)
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
    SaveMeta () {

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
  #Media .card-img {
    height: 150px;
    object-fit: cover;
  }
  #Media.FileItem {
    cursor: pointer;
    transition: background-color 0.3s;
  }
  #Media.FileItem:hover {
    background-color: #f1f1f1;
  }
  #Media .FileItem .card-overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    transition: 0.3s;
    opacity: 0;
  }
  #Media .FileItem:hover .card-overlay {
    background-color: rgba(0,0,0,0.25);
    opacity: 1;
  }
</style>
