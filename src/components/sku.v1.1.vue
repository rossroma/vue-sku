<template>
  <div class="vue-sku">
    <!-- specification setting -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Product Specification Setting</span>
      </div>
      <section>
        <div v-for="(item, index) in specification" :key="index" class="spec-line">
          <div>
            <span v-if="!cacheSpecification[index].status">{{ item.name }}</span>
            <el-input size="small" style="width:200px;" v-if="cacheSpecification[index].status" v-model="cacheSpecification[index].name" placeholder="Product Specifications" @keyup.native.enter="saveSpec(index)">
              <el-button slot="append" icon="el-icon-check" type="primary" @click="saveSpec(index)"></el-button>
            </el-input>
            <i class="icon el-icon-edit" v-if="!cacheSpecification[index].status" @click="updateSpec(index)"></i>
          </div>
          <div>
            <el-tag v-for="(tag, j) in item.value" :key="j" closable  @close="delSpecTag(index, j)">{{ tag }}</el-tag>
            <el-input size="small" style="width:200px;" v-model="addValues[index]" placeholder="Multiple Product Properties Are Separated By Spaces" @keyup.native.enter="addSpecTag(index)">
              <el-button slot="append" icon="el-icon-check" type="primary" @click="addSpecTag(index)"></el-button>
            </el-input>
          </div>
          <i class="icon el-icon-circle-close spec-deleted" @click="delSpec(index)"></i>
          <el-divider></el-divider>
        </div>
        <div class="add-spec">
          <el-button size="small" type="primary" :disabled="specification.length >= 5" @click="addSpec">Add New Specification</el-button>
        </div>
      </section>
    </el-card>

    <!-- specification display -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Specification Display</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="specificationStatus = !specificationStatus">{{ !specificationStatus ? 'show' : 'hide' }}</el-button>
      </div>
      <section v-if="specificationStatus">
        <el-row>
          <el-col :span="2" v-for="(item, index) in specification" :key="index" class="text item bold">{{ item.name }}</el-col>
        </el-row>
        <el-row v-for="(item, index) in countSum(0)" :key="index">
          <el-col :span="2" class="text item" v-for="(n, specIndex) in specification.length" :key="n">{{getSpecAttr(specIndex, index)}}</el-col>
        </el-row>
      </section>
    </el-card>

    <!-- DEMO -->
    <el-card>
      <div slot="header" class="clearfix">
        <span>Specification Table</span>
      </div>
      <table class="el-table" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th
            v-for="(item, index) in specification"
            :key="index">
            {{item.name}}
          </th>
          <th style="width: 160px;">Specification Number</th>
          <th>Cost Price (Yuan)</th>
          <th>Stock</th>
          <th>Sale Price（Yuan）</th>
          <th>Use</th>
        </tr>
        </thead>
        <tbody v-if="specification[0] && specification[0].value.length">
        <tr
          :key="index"
          v-for="(item, index) in countSum(0)">
          <template v-for="(n, specIndex) in specification.length">
            <td
              v-if="showTd(specIndex, index)"
              :key="n"
              :rowspan="countSum(n)">
              {{getSpecAttr(specIndex, index)}}
            </td>
          </template>
          <td>
            <el-input
              size="small"
              type="text"
              :disabled="!childProductArray[index].isUse"
              v-model="childProductArray[index].childProductNo"
              @blur="handleNo(index)"
              placeholder="Product Specifications Number">
            </el-input>
          </td>
          <td>
            <el-input
              size="small"
              type="text"
              v-model.number="childProductArray[index].childProductCost"
              placeholder="Cost Price"
              :disabled="!childProductArray[index].isUse">
            </el-input>
          </td>
          <td>
            <el-input
              size="small"
              type="text"
              v-model.number="childProductArray[index].childProductStock"
              placeholder="Stock"
              :disabled="!childProductArray[index].isUse">
            </el-input>
          </td>
          <td>
            <el-input
              size="small"
              type="text"
              v-model.number="childProductArray[index].childProductPrice"
              placeholder="Sale Price"
              :disabled="!childProductArray[index].isUse">
            </el-input>
          </td>
          <td>
            <el-switch v-model="childProductArray[index].isUse" @change="(val) => {handleUserChange(index, val)}"></el-switch>
          </td>
        </tr>
        <tr>
          <td colspan="8" class="wh-foot">
            <span class="label">Batch Settings：</span>
            <template v-if="isSetListShow">
              <el-button @click="openBatch('childProductCost')" size="mini">Cost Price</el-button>
              <el-button @click="openBatch('childProductStock')" size="mini">Stock</el-button>
              <el-button @click="openBatch('childProductPrice')" size="mini">Sale Price</el-button>
            </template>
            <template v-else>
              <el-input size="mini" style="width:200px;" v-model.number="batchValue" placeholder="Setting Price"></el-input>
              <el-button type="primary" size="mini" @click="setBatch"><i class="set-btn blue el-icon-check"></i></el-button>
              <el-button type="danger" size="mini" @click="cancelBatch"><i class="set-btn blue el-icon-close"></i></el-button>
            </template>
          </td>
        </tr>
        </tbody>

      </table>
    </el-card>

    <!-- Data Form -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Data Form</span>
      </div>
      <section>
        <div v-for="(item, index) in childProductArray" :key="index">
          {{ item }}
          <el-divider></el-divider>
        </div>
      </section>
    </el-card>
  </div>
</template>

<script>

  // Add a prototype method for Object，It is determined whether or not the two objects are equal.
  function objEquals (object1, object2) {
    // For the first loop, we only check for types
    for (let propName in object1) {
      // Check for inherited methods and properties - like .equals itself
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
      // Return false if the return value is different
      if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
        return false
        // Check instance type
      } else if (typeof object1[propName] !== typeof object2[propName]) {
        // Different types => not equal
        return false
      }
    }
    // Now a deeper check using other objects property names
    for (let propName in object2) {
      // We must check instances anyway, there may be a property that only exists in object2
      // I wonder, if remembering the checked values from the first loop would be faster or not
      if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
        return false
      } else if (typeof object1[propName] !== typeof object2[propName]) {
        return false
      }
      // If the property is inherited, do not check any more (it must be equa if both objects inherit it)
      if (!object1.hasOwnProperty(propName)) {
        continue
      }
      // Now the detail check and recursion
      // This returns the script back to the array comparing
      /** REQUIRES Array.equals**/
      if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
        // recurse into the nested arrays
        if (objEquals(!object1[propName], object2[propName])) {
          return false
        }
      } else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
        // recurse into another objects
        // console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
        if (objEquals(!object1[propName], object2[propName])) {
          return false
        }
        // Normal value comparison for strings and numbers
      } else if (object1[propName] !== object2[propName]) {
        return false
      }
    }
    // If everything passed, let's say YES
    return true
  }

  export default {
    name: 'sku.v1.1',

    data () {
      return {
        specificationStatus: false, // Show specification list
        // Specification
        specification: [],
        // Child specification
        childProductArray: [],
        // Used to store specification properties to be added
        addValues: [],
        // Default product number
        defaultProductNo: 'PRODUCTNO_',
        // Batch setting status
        isSetListShow: true,
        batchValue: '', // Batch sets the value of the binding
        currentType: '', // Batch sets the type of the binding
        cacheSpecification: [] // Cache specification
      }
    },

    computed: {
      // All skus' id
      stockSpecArr () {
        return this.childProductArray.map(item => item.childProductSpec)
      }
    },
    created() {
      this.createData()
    },
    methods: {
      // Analog data
      createData() {
        const arr = ['Color', 'Size']
        const arr2 = ['Black White Blue', 's m xl']
        for (let i = 0; i < 2; i++) {
          // Add data
          this.addSpec()
          // Data
          this.specification[i].name = arr[i]
          this.addValues[i] = arr2[i]
          // Cache button value
          this.cacheSpecification[i].status = false
          this.cacheSpecification[i].name = arr[i]
          // Generate
          this.addSpecTag(i)
        }
      },
      // Add specification items
      addSpec () {
        if (this.specification.length < 5) {
          this.cacheSpecification.push({
            status: true,
            name: ''
          })
          this.specification.push({
            name: '',
            value: []
          })
        }
      },
      // Update status
      updateSpec(index) {
        this.cacheSpecification[index].status = true
        this.cacheSpecification[index].name = this.specification[index].name
      },
      // Save specification name
      saveSpec(index) {
        if (!this.cacheSpecification[index].name.trim()) {
          this.$message.error('The name cannot be empty')
          return
        }
        // Save needs to verify that the name is duplicated
        if (this.specification[index].name === this.cacheSpecification[index].name) {
          this.cacheSpecification[index].status = false
        } else {

          if (this.verifyRepeat(index)) {
            // If there is repetition, can't be modified
            this.$message.error('Duplicate name')
          } else {
            this.specification[index].name = this.cacheSpecification[index].name
            this.cacheSpecification[index].status = false
          }
        }
      },
      // delete specification item
      delSpec (index) {
        this.specification.splice(index, 1)

        this.handleSpecChange('del')
      },
      verifyRepeat(index) {
        let flag = false
        this.specification.forEach((value, j) => {
          // Check for duplicate,if true, can't modify
          if (index !== j) {
            if (this.specification[j].name === this.cacheSpecification[index].name) {
              flag = true
            }
          }
        })
        return flag
      },
      // Add specification
      addSpecTag (index) {
        let str = this.addValues[index] || ''
        // Check empty
        if (!str.trim() || !this.cacheSpecification[index].name.trim()) {
          this.$message.error("specification can't be empty")
          return
        }
        str = str.trim()
        let arr = str.split(/\s+/) // Split into arrays using spaces

        let newArr = this.specification[index].value.concat(arr)
        newArr = Array.from(new Set(newArr)) // de-duplication
        this.$set(this.specification[index], 'value', newArr)

        this.clearAddValues(index)

        this.handleSpecChange('add')
        this.specification[index].name = this.cacheSpecification[index].name
        this.cacheSpecification[index].status = false
      },

      // Delete specification
      delSpecTag (index, num) {
        this.specification[index].value.splice(num, 1)

        this.handleSpecChange('del')
      },

      // clear addValues
      clearAddValues (index) {
        this.$set(this.addValues, index, '')
      },

      /*
        According to the value of the property passed in, get the property of the corresponding specification.
        @params
          specIndex: Serial number of specification item in advancedSpecification
          index: The ordinal number when the property is traversing
      */
      getSpecAttr (specIndex, index) {
        // Gets the property value of the current specification item
        const currentValues = this.specification[specIndex].value
        let indexCopy

        // Judge the last specification item
        if (this.specification[specIndex + 1] && this.specification[specIndex + 1].value.length) {
          indexCopy = index / this.countSum(specIndex + 1)
        } else {
          indexCopy = index
        }

        const i = Math.floor(indexCopy % currentValues.length)

        if (i.toString() !== 'NaN') {
          return currentValues[i]
        } else {
          return ''
        }
      },

      /*
        The product of the calculated properties
        @params
          specIndex: Serial number of specification item in advancedSpecification
      */
      countSum (specIndex) {
        let num = 1
        this.specification.forEach((item, index) => {
          if (index >= specIndex && item.value.length) {
            num *= item.value.length
          }
        })
        return num
      },

      // Based on the incoming criteria, determine whether to display the td
      showTd (specIndex, index) {
        // If the current item does not have any property, it does not display
        if (!this.specification[specIndex]) {
          return false

          // Understand by yourself
        } else if (index % this.countSum(specIndex + 1) === 0) {
          return true
        } else {
          return false
        }
      },

      /**
       * [handleSpecChange: When the label is added, the change of the label is monitored; the hash id of each line is obtained and the inventory information is dynamically changed; when the label is deleted, the existing inventory information is first emptied, the original inventory information is temporarily stored in the stockCopy, and the later call is convenient]
       * @param  {[string]} option ['add'|'del' Operation type，add or deleted]
       * @return {[type]}        [description]
       */
      handleSpecChange (option) {
        const stockCopy = JSON.parse(JSON.stringify(this.childProductArray))
        if (option === 'del') {
          this.childProductArray = []
        }

        for (let i = 0; i < this.countSum(0); i++) {
          this.changeStock(option, i, stockCopy)
        }
      },

      /**
       * [Dynamically change inventory-related information according to specifications.]
       * @param  {[string]} option    ['add'|'del', Operation type，add or deleted]
       * @param  {[array]} stockCopy [Copy of inventory information]
       * @return {[type]}           [description]
       */
      changeStock (option, index, stockCopy) {
        let childProduct = {
          childProductId: 0,
          childProductSpec: this.getChildProductSpec(index),
          childProductNo: this.defaultProductNo + index,
          childProductStock: 0,
          childProductPrice: 0,
          childProductCost: 0,
          isUse: true
        }

        const spec = childProduct.childProductSpec
        if (option === 'add') {
          // If the id does not exist, the description is a new attribute, and a data is added to the child Array
          if (this.stockSpecArr.findIndex((item) => objEquals(spec, item)) === -1) {
            this.$set(this.childProductArray, index, childProduct)
          }
        } else if (option === 'del') {
          // Because it's a delete operation, in theory, all the data can be obtained from stockCopy.
          let origin = ''
          stockCopy.forEach(item => {
            if (objEquals(spec, item.childProductSpec)) {
              origin = item
              return false
            }
          })
          this.childProductArray.push(origin || childProduct)
        }
      },

      // Gets the childProductSpec property of the childProductArray.
      getChildProductSpec (index) {
        let obj = {}
        this.specification.forEach((item, specIndex) => {
          obj[item.name] = this.getSpecAttr(specIndex, index)
        })
        return obj
      },

      // Monitoring specification enable operation
      handleUserChange (index, value) {
        // Generate a non-duplicate product when the specification is enabled; clear the product number when the specification is turned off.
        if (value) {
          let No = this.makeProductNoNotRepet(index)
          this.$set(this.childProductArray[index], 'childProductNo', No)
        } else {
          this.$set(this.childProductArray[index], 'childProductNo', '')
        }
      },

      // Listening to the blur event of product number
      handleNo (index) {
        /* When the user enters the item number, it will judge whether it is repeated. If there is any repetition, it will prompt the user and automatically modify the item number to not repeat */
        const value = this.childProductArray[index].childProductNo
        let isRepet

        this.childProductArray.forEach((item, i) => {
          if (item.childProductNo === value && i !== index) {
            isRepet = true
          }
        })

        if (isRepet) {
          this.$message({
            type: 'warning',
            message: 'Duplicate item numbers are not allowed to be entered'
          })
          this.$set(this.childProductArray[index], 'childProductNo', this.makeProductNoNotRepet(index))
        }
      },

      // Generate a non-duplicate product number
      makeProductNoNotRepet (index) {
        let No
        let i = index
        let isRepet = true
        while (isRepet) {
          No = this.defaultProductNo + i
          isRepet = this.isProductNoRepet(No)
          i++
        }
        return No
      },

      // Product number judgment of repetition
      isProductNoRepet (No) {
        const result = this.childProductArray.findIndex((item) => {
          return item.childProductNo === No
        })
        return result > -1
      },

      // Open the setting modal
      openBatch (type) {
        this.currentType = type
        this.isSetListShow = false
      },

      // Batch setting
      setBatch () {
        if (typeof this.batchValue === 'string') {
          this.$message({
            type: 'warning',
            message: 'Please enter the correct value'
          })
          return
        }
        this.childProductArray.forEach(item => {
          if (item.isUse) {
            item[this.currentType] = this.batchValue
          }
        })

        this.cancelBatch()
      },

      // Batch setting cancel
      cancelBatch () {
        this.batchValue = ''
        this.currentType = ''
        this.isSetListShow = true
      }
    }
  }
</script>

<style lang="scss" scoped>
.vue-sku{
  .spec-line{position:relative;
    .spec-deleted{position:absolute;right:0;top:0;display: none;cursor: pointer;}
    &:hover{
      .spec-deleted{display: inline;}
    }
  }
}
</style>
