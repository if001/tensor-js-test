# tensor-jsテスト

## セットアップ
lite-serverでとりあえずサーバーを立てる

python側で以下のようにして、モデルを保存しておく
```
import tensorflowjs as tfjs
tfjs.converters.save_keras_model(model, "./")
```

- model.json
- group〜

のファイルが生成されるので、severから読み込めるようにしておく


index.htmlに以下のように書いておくと、cdn経由でtensor-jsを取ってくる

```
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.8.0"></script>
```


## モデルのロード
モデルはmodel.jsonだけ指定すれば良い

```
var model
window.onload = function(){
    model = tf.loadModel('http://モデルのパス');
}
```


loadModelがpromise型を返すので、以下のようにしてpredictを行う

```
model.then((m) => {
	predict = m.predict(input);
}.catch(function (error) {
	console.log(error);
});
```



