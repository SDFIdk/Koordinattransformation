import store from "@/store/index";
export default class Transformer {
    async transform(_inputEpsg, _inputCoords, _outputEpsg, _is3D) {
        try {
            if (_inputEpsg === _outputEpsg)
                return this.transformNone();
            if (_is3D)
                return await this.transform3D(_inputEpsg ,_inputCoords, _outputEpsg);
            else
                return await this.transform2D(_inputEpsg, _inputCoords, _outputEpsg);
        }
        catch (error) {
            console.log(error);
        }
    }

    // sæt outputtet med tre koordinater
    async transform3D(inputEpsg, inputCoords, outputEpsg) {
        const outputCoords = [];

        store.dispatch(
            "trans/get",
            inputEpsg +
            "/" +
            outputEpsg +
            "/" +
            inputCoords[0] +
            "," +
            inputCoords[1] +
            "," +
            inputCoords[2]
        )
        .then(() => {
            const output = store.state.trans.data;
            // if (output.message !== undefined) {
            //   error(output.message)
            //   return
            // }
            outputCoords[0] = parseFloat(output.v1);
            outputCoords[1] = parseFloat(output.v2);
            outputCoords[2] = parseFloat(output.v3);
            console.log("transform3D", outputCoords);
            console.table(outputCoords);
        });
        return outputCoords;
    }

    // sæt outputtet med to koordinater
    async transform2D(inputEpsg, inputCoords, outputEpsg) {
        const outputCoords = [];
        store.dispatch(
            "trans/get",
            inputEpsg + "/" +
            outputEpsg + "/" +
            inputCoords[0] + "," +
            inputCoords[1]
        )
        .then(() => {
            const output = store.state.trans.data;
            // if (output.message !== undefined) {
            //   error(output.message)
            //   return
            // }
            outputCoords[0] = parseFloat(output.v1);
            outputCoords[1] = parseFloat(output.v2);
            // console.table(outputCoords)

            return outputCoords;
        });
    }

    // send inputtet direkte igennem til outputtet
    transformNone(inputEpsg, inputCoords, outputEpsg) {
        const outputCoords = [];

        store.dispatch(
            "trans/get",
            inputEpsg + "/" + outputEpsg + "/" + inputCoords[0] + "," + inputCoords[1] + "," + inputCoords[2]
        )
        .then(() => {
            const output = store.state.trans.data;
            // if (output.message !== undefined) {
            //   error(output.message)
            //   return
            // }
            outputCoords[0] = parseFloat(output.v1);
            outputCoords[1] = parseFloat(output.v2);
            outputCoords[2] = parseFloat(output.v3);
            console.log("transform3D", outputCoords);
            console.table(outputCoords);
        });
        return outputCoords;
    }
}
