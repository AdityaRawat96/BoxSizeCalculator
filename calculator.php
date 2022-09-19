<?php
    require_once __DIR__ . '/vendor/autoload.php';

    use DVDoug\BoxPacker\InfalliblePacker;
    use DVDoug\BoxPacker\Test\CustomBox;  // use your own `Box` implementation
    use DVDoug\BoxPacker\Test\TestItem; // use your own `Item` implementation
    use DVDoug\BoxPacker\Test\PackedBoxByReferenceSorter; // use your own `Sorter` implementation

    $packer = new InfalliblePacker();
    $packer->setMaxBoxesToBalanceWeight(0);
    //$sorter = new PackedBoxByReferenceSorter();
    //$packer->setPackedBoxSorter($sorter);

    define("PHP_EOL_BR", "<br/>");

    /*
     * Add choices of box type.
     */
    $BOX_LIST = $_POST['BOX_LIST'];
    foreach($BOX_LIST as $box){
        $packer->addBox(
            new CustomBox(
                $box['name'], 
                $box['width'], 
                $box['length'], 
                $box['height'], 
                $box['weight'])
            );
    }
    // $packer->addBox(new CustomBox('Small box', 10, 10, 10, 1000));
    // $packer->addBox(new CustomBox('Medium box', 20, 20, 20, 8000));
    // $packer->addBox(new CustomBox('Large box', 30, 30, 30, 27000));

    /*
     * Add items to be packed.
     */
    $ITEM_LIST = $_POST['ITEM_LIST'];
    foreach($ITEM_LIST as $item){
        $packer->addItem(
            new TestItem(
                $item['name'], 
                $item['width'], 
                $item['length'], 
                $item['height'], 
                $item['weight'],
                false),
                $item['qty'], 
            );
    }
    // $packer->addItem(new TestItem('Custom Item 1', 10, 10, 10, 1000, true), 35);
    // $packer->addItem(new TestItem('Custom Item 2', 50, 50, 50, 1000, true), 2);

    $packedBoxes = $packer->pack();

    $response = "";

    $response .= "<b>These items fitted into " . count($packedBoxes) . " box(es)</b>" . PHP_EOL_BR;
    $response .= PHP_EOL_BR;
    foreach ($packedBoxes as $packedBox) {
        $boxType = $packedBox->getBox(); 
        $response .= "This box is a <b>{$boxType->getReference()}</b>, it is {$boxType->getOuterWidth()}mm wide, {$boxType->getOuterLength()}mm long and {$boxType->getOuterDepth()}mm high" . PHP_EOL;
        $response .= "The combined weight of this box and the items inside it is {$packedBox->getWeight()}g" . PHP_EOL_BR;
        $response .= "The box utilization is - {$packedBox->getVolumeUtilisation()}%" . PHP_EOL_BR;

        $packedItems = $packedBox->getItems();
        $response .= "The items in this box are: (". count($packedItems) .")" . PHP_EOL_BR;
        $response .= "<ul>";
        foreach ($packedItems as $packedItem) { 
            $response .= "<li>" . $packedItem->getItem()->getDescription() . "</li>";
        }
        $response .= "</ul>";
        $response .= PHP_EOL_BR;
    }

    $unpackedItems = $packer->getUnpackedItems();
    if(count($unpackedItems)){
        $response .= PHP_EOL_BR;
        $response .= PHP_EOL_BR;
        $response .= "<b>These " . count($unpackedItems) . " items did not fit into any box(es)</b>" . PHP_EOL_BR;
        $response .= "<ul>";
        foreach ($unpackedItems as $unpackedItem) { 
            $response .= "<li>" . $unpackedItem->getDescription() . "</li>";
        }
        $response .= "</ul>";
    }

    $data["output"] = $response;
    $data["result"] = $packedBoxes;

    echo json_encode($data);
    